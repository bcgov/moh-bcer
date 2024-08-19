import { BusinessReportOverview } from '@/constants/localInterfaces';
import { styled } from '@mui/material/styles';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { StyledTextWithStatusIcon } from 'vaping-regulation-shared-components';
import axios from 'axios';

const PREFIX = 'ReportingSummary';

const classes = {
  title: `${PREFIX}-title`,
  text: `${PREFIX}-text`
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.title}`]: {
    fontWeight: 'bold',
    fontSize: '17px',
  },

  [`& .${classes.text}`]: {
    fontSize: '14px',
    lineHeight: '18px',
    color: '#333',
  }
}));

function ReportingSummary() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [{data: reportOverview, loading: reportLoading, error: reportError}, getReportOverview] = useAxiosGet<BusinessReportOverview>('/data/business/overview');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        await getReportOverview({ cancelToken: source.token });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setAppGlobal({
            ...appGlobal,
            networkErrorMessage: formatError(error),
          });
        }
      }
    };
    fetchData();
    return () => {
      source.cancel('Component unmounted');
    };
  }, []);

  return (
    <StyledBox>
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
    </StyledBox>
  );
}

export default ReportingSummary;