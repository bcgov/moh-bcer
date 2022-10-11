import BusinessInfo from '@/components/BusinessInfo';
import Page from '@/components/generic/Page';
import Note from '@/components/note/Note';
import {
  BusinessReportStatus,
  LocationRO,
} from '@/constants/localInterfaces';
import { routes } from '@/constants/routes';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  BusinessDashboard,
  LocationType,
  StyledButton,
  StyledSelectField,
  StyledTextField
} from 'vaping-regulation-shared-components';
import { healthAuthorityOptions } from '@/constants/arrays';
import { Form, Formik } from 'formik';
import SearchIcon from '@material-ui/icons/Search';
import { SearchQueryBuilder } from '@/constants/localInterfaces';

const useStyles = makeStyles(() => ({
  link: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  breadcrumb: {
    paddingBottom: '20px'
  },
  clickBack: {
    cursor: 'pointer',
    color: 'rgba(51, 51, 51, 0.5)',
  },
}));

function BusinessDetails() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const classes = useStyles();
  const [{ data, error, loading }] = useAxiosGet<{
    locations: LocationRO[];
    overview: BusinessReportStatus;
  }>('/data/business/report-overview/' + id);

  const [filteredData, setFilteredData] = useState<{
    locations: LocationRO[];
    overview: BusinessReportStatus;
  }>();

  const renderAddress = (l: LocationRO) => (
    <span
      className={classes.link}
      onClick={() => {
        setAppGlobal({
          ...appGlobal,
          history: history.location
        })
        history.push(`${routes.viewLocation}/${l.id}`)
      }}
    >
      {l.location_type === LocationType.online ? l.webpage : l.addressLine1}
    </span>
  );

  useEffect(() => {
    if(error){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error)
      })
    }
  }, [error])

  useEffect(() => {    
      setFilteredData({...data})    
  }, [data]);

  const onChangeSearch = (query: Partial<SearchQueryBuilder>) => {   
    filteredData.locations = data.locations;    

    if(query?.healthAuthority !== "all") { 
      filteredData.locations = data.locations.filter(location => location.health_authority === query.healthAuthority);   
    }

    if(query?.search !== "") {
      const search = query.search.toLowerCase();   
      filteredData.locations = data.locations.filter(location => location.addressLine1.toLowerCase().includes(search) 
                             || location.addressLine2?.toLowerCase().includes(search)
                             || location.postal.toLowerCase().includes(search)
                             || location.city.toLowerCase().includes(search)
                             || location.doingBusinessAs?.toLowerCase().includes(search));
    }

    setFilteredData({...filteredData});
  }

  return (
    <Page error={error}>
      {loading && <CircularProgress />}
      <Typography variant="body1" className={classes.breadcrumb} ><span className={classes.clickBack} onClick={() => history.goBack()}>Dashboard</span> / Business Details</Typography>
      <BusinessInfo businessId={id} />
      <Box pb={3}/>
      <Note targetId={id} type='business' showHideButton={true} />
      <Box pb={3}/>

      <BusinessLocationSearch onSubmit={onChangeSearch} />

      <BusinessDashboard
        data={filteredData}
        showOverview={true}
        showStatusMessage={true}
        renderAddress={renderAddress}
      />
    </Page>
  );
}

export default BusinessDetails;

interface BusinessLocationSearch {
  onSubmit: (v: Partial<(SearchQueryBuilder)>) => void;
}

export function BusinessLocationSearch(
  {onSubmit}: BusinessLocationSearch,
) {

  return (
      <Box my={2}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            search: '',
            healthAuthority: 'all',
          }}
        >
          <Form>
            <Box display="flex" alignItems="flex-end">
              <Box flex={0.66}>
                <Box flex={1}>
                  <StyledTextField
                    name="search"
                    placeholder="Type in keyword.."
                    label = "Search (Address, Doing Business As.)"
                  />
                </Box>
              </Box>
              <Box flex={0.01} />
              <Box flex={0.19}>
                <StyledSelectField
                  name="healthAuthority"
                  options={healthAuthorityOptions}
                  label="Health Authority"
                />
              </Box>
              <Box flex={0.01} />
              <Box flex={0.13}>
              <StyledButton variant="dialog-accept" type="submit">
                <SearchIcon />
                <Box mr={1} />
                Search
              </StyledButton>
              <Box pb={3}/>
            </Box>
            </Box>
          </Form> 
        </Formik>
      </Box>
  );
}