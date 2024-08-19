import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Form, Formik } from 'formik';

import BusinessInfo from '@/components/BusinessInfo';
import Page from '@/components/generic/Page';
import Note from '@/components/note/Note';
import { BusinessReportStatus, LocationRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { routes } from '@/constants/routes';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { BusinessDashboard, LocationType, StyledButton, StyledSelectField, StyledTextField } from 'vaping-regulation-shared-components';
import { healthAuthorityOptions } from '@/constants/arrays';

const PREFIX = 'BusinessDetails';

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${PREFIX}-breadcrumb`]: {
    paddingBottom: '20px'
  },
  [`& .${PREFIX}-clickBack`]: {
    cursor: 'pointer',
    color: 'rgba(51, 51, 51, 0.5)',
  },
}));

const StyledLink = styled('span')({
  color: 'blue',
  textDecoration: 'underline',
  cursor: 'pointer',
});

const StyledSubmitButtonGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down("xs")]: {
    marginTop: -30,
    marginBottom: 10
  }
}));

function BusinessDetails() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [{ data, error, loading }] = useAxiosGet<{
    locations: LocationRO[];
    overview: BusinessReportStatus;
  }>('/data/business/report-overview/' + id);

  const [filteredData, setFilteredData] = useState<{
    locations: LocationRO[];
    overview: BusinessReportStatus;
  }>();

  const renderAddress = (l: LocationRO) => (
    <StyledLink
      onClick={() => {
        setAppGlobal({
          ...appGlobal,
          history: window.location
        })
        navigate(`${routes.viewLocation}/${l.id}`)
      }}
    >
      {l.location_type === LocationType.online ? l.webpage : l.addressLine1}
    </StyledLink>
  );

  useEffect(() => {
    if(error){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error)
      })
    }
  }, [error, appGlobal, setAppGlobal])

  useEffect(() => {    
    setFilteredData({...data})    
  }, [data]);

  const onChangeSearch = (query: Partial<SearchQueryBuilder>) => {   
    if (!filteredData || !data) return;
    
    let newLocations = data.locations;    

    if(query?.healthAuthority !== "all") { 
      newLocations = newLocations.filter(location => location.health_authority === query.healthAuthority);   
    }

    if(query?.search) {
      const search = query.search.toLowerCase();   
      newLocations = newLocations.filter(location => 
        location.addressLine1.toLowerCase().includes(search) 
        || location.addressLine2?.toLowerCase().includes(search)
        || location.postal.toLowerCase().includes(search)
        || location.city.toLowerCase().includes(search)
        || location.doingBusinessAs?.toLowerCase().includes(search)
      );
    }

    setFilteredData({...filteredData, locations: newLocations});
  }

  return (
    <Page error={error}>
      {loading && <CircularProgress />}
      <StyledBox>
        <Typography variant="body1" className={`${PREFIX}-breadcrumb`}>
        <span className={`${PREFIX}-clickBack`} onClick={() => navigate(-1)}>Dashboard</span> / Business Details
        </Typography>
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
      </StyledBox>
    </Page>
  );
}

interface BusinessLocationSearchProps {
  onSubmit: (v: Partial<SearchQueryBuilder>) => void;
}

function BusinessLocationSearch({ onSubmit }: BusinessLocationSearchProps) {
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
          <Grid container spacing={2}>
            <Grid item xs={12} lg={7}>
              <StyledTextField
                name="search"
                placeholder="Type in keyword.."
                label="Search (Address, Doing Business As.)"
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <StyledSelectField
                name="healthAuthority"
                options={healthAuthorityOptions}
                label="Health Authority"
              />
            </Grid>
            <StyledSubmitButtonGrid  item xs={12} lg={2} >
              <Grid>&nbsp;</Grid>
              <StyledButton variant="dialog-accept" type="submit">
                <SearchIcon />
                Search
              </StyledButton>
            </StyledSubmitButtonGrid>
          </Grid>
        </Form> 
      </Formik>
    </Box>
  );
}

export default BusinessDetails;