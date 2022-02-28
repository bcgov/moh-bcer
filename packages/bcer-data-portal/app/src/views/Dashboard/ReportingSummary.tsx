import { BusinessReportOverview } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { StyledTextWithStatusIcon } from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: 'bold',
    fontSize: '17px',
  },
  text: {
    fontSize: '14px',
    lineHeight: '18px',
    color: '#333',
  },
}));

function ReportingSummary() {
  const classes = useStyles();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{data: reportOverview, loading: reportLoading, error: reportError}] = useAxiosGet<BusinessReportOverview>('/data/business/overview');

  useEffect(() => {
    if(reportError){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(reportError),
      })
    }
  }, [reportError])
  
  return (
    <Box>
      <Typography className={classes.title}>Businesses Overview</Typography>
      <Box mt={1} />
      {reportOverview && (
        <Box>
          <StyledTextWithStatusIcon
            text={<><b>{reportOverview.compliant ?? 0}</b> Business(es) with complete reports.</>}
            success={!!reportOverview.compliant}
          />
          <StyledTextWithStatusIcon
            text={<><b>{reportOverview.nonCompliant ?? 0}</b> Business(es) with missing reports.</>}
            success={!reportOverview.nonCompliant}
          />
        </Box>
      )}
    </Box>
  );
}

export default ReportingSummary;
