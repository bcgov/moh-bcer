import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { makeStyles, CircularProgress, Typography, Box } from '@mui/material';
import { BusinessDashboard, LocationType } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';

import { BusinessLocation, BusinessReportStatus } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import moment from 'moment';
import { LocationStatus } from '@/constants/localEnums';

const PREFIX = 'Overview';

const classes = {
  title: `${PREFIX}-title`,
  reportingPeriodDisclaimer: `${PREFIX}-reportingPeriodDisclaimer`
};

const Root = styled('div')({
  [`& .${classes.title}`]: {
    color: '#0F327F',
    paddingBottom: '30px',
    paddingTop: 0,
  },
  [`& .${classes.reportingPeriodDisclaimer}`]: {
    display: 'flex',
    padding: '10px 15px',
    marginBottom: '20px'
  }
});

export default function MyDashboard () {

  const navigate = useNavigate();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{ data, error, loading }] = useAxiosGet<{
    locations: BusinessLocation[];
    overview: BusinessReportStatus;
  }>('/business/report-overview');

  useEffect(() => {
    if(appGlobal && !appGlobal.myBusinessComplete) {
      navigate('/')
    }
  }, [appGlobal])

  const getReportingText = () => {
    const currentTime = moment();
    const currentDay = currentTime.get('dayOfYear')
    const endOfReporting = 15
    const startOfReporting = 274
    const relevantYear = currentDay >= startOfReporting ? currentTime.add(1, 'year').format('yyyy') : currentTime.format('yyyy')

    if (currentDay >= startOfReporting || currentDay <= endOfReporting) {
      return `You are in the reporting period and have until January 15th ${relevantYear} to submit the outstanding reports.`
    } else {
      if (data?.overview?.incompleteReports?.length) {
        return `Your outstanding reports must be submitted before the next reporting period that will start on October 1st ${relevantYear}.`
      } else {
      }
        return `Thank you for submitting your reports, the next reporting period will start on October 1st ${relevantYear}.`
    } 
  }

  return (
    <Root>
      <Typography variant='h5' className={classes.title}>My Dashboard</Typography>
      {
        loading ? <CircularProgress /> :
        data
          ?
            <>
              <Box 
                className={classes.reportingPeriodDisclaimer} 
                style={{ 
                  borderLeft: `10px solid ${data?.overview?.incompleteReports?.length ? '#F5A623' : '#0053A4'}`, 
                  backgroundColor: data?.overview?.incompleteReports?.length ? 'rgba(245,166,35,0.1)' : 'rgba(0,83,164,0.1)'
                }}
              >
                <Typography variant='subtitle1'>{getReportingText()}</Typography>
              </Box>
              <BusinessDashboard 
                data={data}
                showOverview={true}
                showStatusMessage={true}
                isRetailerPortal={true}
                renderAddress={(l: BusinessLocation) => <span>{l.location_type === LocationType.online ? l.webpage : l.addressLine1}</span>}
              />

              {
                data?.overview?.incompleteReports?.length === 0
                  &&                  
                <Typography variant='body1'>
                  You have no outstanding reports to submit. Please make sure to continue updating your list of products and manufacturing throughout the year.
                  On October 1st, 2022 you will have:
                  <ul>
                    <li>{data.locations.map(l => l.status !== LocationStatus.Closed).length} Notice of intents to renew</li>
                    <li>{data.locations.length} Sales Reports to submit</li>
                  </ul>
                </Typography>
              }
            </>
          :
        null
      }
    </Root>
  );
}
