import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAxiosGet } from '@/hooks/axios';
import { makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppGlobalContext } from '@/contexts/AppGlobal';
import { BusinessLocation } from '@/constants/localInterfaces';
import { formatError } from '@/utils/formatting';
import NoiSubmission from '@/components/Noi/NoiSubmission';
import { NoiUtil } from '@/utils/noi.util';
import { OutstandingNoiTable, SubmittedNoiTable } from './Tables';
import FullScreen from '@/components/generic/FullScreen';

const useStyles = makeStyles({
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
});

export default function NoiOverview() {
  const classes = useStyles();
  const history = useHistory();
  const [outstanding, setOutstanding] = useState<Array<BusinessLocation>>([]);
  const outstandingFullscreenState = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<Array<BusinessLocation>>([]);
  const submittedFullscreenState = useState<boolean>(false);
  const { location: { pathname } } = history;
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/location?includes=noi`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);


  useEffect(() => {
    if (pathname.includes('success') && !appGlobal.noiComplete) {
      setAppGlobal({ ...appGlobal, noiComplete: true })
    }
  }, [pathname, appGlobal.noiComplete]);

  useEffect(() => {
    if (locations.length) {
      const outstanding = locations.filter(NoiUtil.outstandingNoi);
      const submitted = locations.filter(NoiUtil.submittedNoi);
      setOutstanding(outstanding);
      setSubmitted(submitted);
    }
  }, [locations]);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error]);

  return loading ? <CircularProgress /> : (
    <>
      <div>
        <div className={classes.actionsWrapper}>
        <Typography className={classes.title} variant='h5'>Notice of Intent</Typography>
        </div>
        {
          pathname === '/noi/success'
            ?
              <NoiSubmission />
            :
            null
        }
        <>
          <Typography variant='body1'>
            Business owners must notify the Ministry of Health of their intent to sell restricted E-substances by submitting a, Notice of Intent to sell E-Substances to the Ministry of Health. The Notice of Intent to Sell E-Substances is required for each separate sales premises for your business and for the sale of non-therapeutic nicotine E-substances. Business owners will be required to submit the following information:
          </Typography>
          <ul>
            <li><Typography variant='body1'>Legal name of business</Typography></li>
            <li><Typography variant='body1'>Name under which business conducted</Typography></li>
            <li><Typography variant='body1'>Address of sales premises from which restricted E-substances are sold</Typography></li>
            <li><Typography variant='body1'>Phone Number for sales premises</Typography></li>
            <li><Typography variant='body1'>Email address for sales premises</Typography></li>
            <li><Typography variant='body1'>Webpage for sales premises (if applicable)</Typography></li>
            <li><Typography variant='body1'>If persons under 19 years of age are permitted on the sales premises</Typography></li>
            <li><Typography variant='body1'>Health authority in which the retail location is located</Typography></li>
          </ul>
          <Typography variant='body1'>
            The business owner must submit the Notice of Intent a minimum of 6 weeks before an e-substance is first sold from the sales premises. The Notice of Intent must also be submitted prior to January 15 of each year that a retailer intends to continue sales.
          </Typography>
          <Typography variant='h6'>[TODO: Add info]</Typography>
        </>
        <FullScreen 
          fullScreenProp={outstandingFullscreenState}
        >
          <OutstandingNoiTable 
            data={outstanding} 
            handleActionButton={()=>{history.push('/noi/submit')}}
            fullScreenProp={outstandingFullscreenState}
          />
        </FullScreen>
        <FullScreen
          fullScreenProp={submittedFullscreenState}
        >
          <SubmittedNoiTable 
            data={submitted}
            fullScreenProp={submittedFullscreenState}
          />
        </FullScreen>
      </div>
    </>
  );
}
