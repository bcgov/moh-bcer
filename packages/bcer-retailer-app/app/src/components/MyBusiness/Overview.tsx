import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, CircularProgress, Typography, Box } from '@material-ui/core';
import { BusinessDashboard } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';

import { BusinessLocation, BusinessReportStatus } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import moment from 'moment';
import { LocationStatus } from '@/constants/localEnums';

const useStyles = makeStyles({
  title: {
    color: '#0F327F',
    paddingBottom: '30px',
    paddingTop: 0,
  },
  reportingPeriodDisclaimer: {
    display: 'flex',
    padding: '10px 15px',
    marginBottom: '20px'
  }
})

export default function MyDashboard () {
  const classes = useStyles();
  const history = useHistory();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{ data, error, loading }] = useAxiosGet<{
    locations: BusinessLocation[];
    overview: BusinessReportStatus;
  }>('/business/report-overview');

  useEffect(() => {
    if(appGlobal && !appGlobal.myBusinessComplete) {
      history.push('/')
    }
  }, [appGlobal])

  const getReportingYear = (startingMonth: number) => {
    const currentTime = moment();
    const currentMonth = currentTime.get('month')
    if (currentMonth <= startingMonth) {
      return currentTime.format('yyyy')
    } else {
      return currentTime.add(1, 'year').format('yyyy')
    }
  }

  return (
    <div>
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
                <Typography variant='subtitle1'>
                  {
                    data?.overview?.incompleteReports?.length 
                    ? `The next reporting period will start on October 1st, ${getReportingYear(10)}`
                    : `You are in the reporting period and have until January 15th, ${getReportingYear(0)} to submit the outstanding reports.`
                  }
                </Typography>
              </Box>
              <BusinessDashboard 
                data={data}
                showOverview={true}
                showStatusMessage={true}
                isRetailerPortal={true}
                renderAddress={(l: BusinessLocation) => <span>{l.addressLine1}</span>}
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
    </div>
  )
}
