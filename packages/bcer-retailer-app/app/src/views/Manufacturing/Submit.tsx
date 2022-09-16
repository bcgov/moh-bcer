import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

import ManufacturingReportForm from '@/components/form/forms/ManufacturingReportForm';
import ManufacturingReportSubmitButton from '@/components/ManufacturingReports/SubmitButton.tsx';

import { useAxiosGet } from '@/hooks/axios';

import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';
import { getInitialPagination } from '@/utils/util';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  boxTitle: {
    padding: '10px 0px'
  },
  tableRowCount: {
    paddingBottom: '10px'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  section: {
    margin: '2rem 0',
  },
  highlightedText: {
    fontWeight: 600,
    color: 'black'
  },
});

export default function ManufacturingSubmit() {
  const classes = useStyles();
  const history = useHistory();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const viewFullscreenTable = useState<boolean>(false);
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/manufacturing/locations`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  return (loading) ? <CircularProgress /> : (
    <div>
      <div>
        <StyledButton onClick={() => history.push('/manufacturing')}>
          <ArrowBackIcon className={classes.buttonIcon} /> Back
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Add Manufacturing Report
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
          You are required to enter this information manually. This section only applies to retailers that formulate, package or re-package e-substances for sale from their retail location.
          If you believe this does not apply to your business or any of your locations, please return to the business details section and select <span className={classes.highlightedText}>“No”</span> on the question <span className={classes.highlightedText}>“Does your business formulate, package or re-package e-substances for sale in your retail location?”</span>
          </Typography>
        </div>

        <ManufacturingReportForm>
          <FullScreen fullScreenProp={viewFullscreenTable}>
            <TableWrapper
              tableHeader={<Typography className={classes.boxTitle} variant='h6'>2. Location Information</Typography>}
              tableSubHeader='Please select the location(s) that this manufacturing report applies to'
              data={locations}
              fullScreenProp={viewFullscreenTable}
              isOutlined={false} 
            >
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <StyledTable
                  columns={[
                    {title: 'Address', render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`},
                    {title: 'Email Address', field: 'email'},
                    {title: 'Phone Number', field: 'phone'},
                  ]}
                  data={locations}
                  options={{ 
                    selection: true, 
                    pageSize: getInitialPagination(locations),
                    pageSizeOptions: [5, 10, 20, 30, 50] 
                  }}
                  onSelectionChange={(rows: any) => {
                    setSelectedLocations(rows.map((row: BusinessLocation) => row.id))
                  }}
                />
              </div>
            </TableWrapper>
          </FullScreen>
          <div className={classes.submitWrapper}>
            <ManufacturingReportSubmitButton selectedLocations={selectedLocations} />
          </div>
        </ManufacturingReportForm>
      </div>
    </div>
  );
}
