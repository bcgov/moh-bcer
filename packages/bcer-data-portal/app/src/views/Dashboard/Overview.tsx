import BusinessSearch from '@/components/generic/BusinessSearch';
import Page from '@/components/generic/Page';
import { businessSearchCategoryOptions } from '@/constants/arrays';
import { ConfigContext } from '@/contexts/Config';
import useBusiness from '@/hooks/useBusiness';
import { LinearProgress, makeStyles, Paper } from '@material-ui/core';
import React, { useContext } from 'react';
import BusinessTable from './BusinessTable';
import ReportingSummary from './ReportingSummary';

const useStyles = makeStyles(() => ({
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
}));

function Dashboard() {
  const classes = useStyles();

  const { config } = useContext(ConfigContext);

  const {
    businessList,
    businessError,
    businessLoading,
    onChangeSearch,
    searchOptions,
  } = useBusiness();

  return (
    <Page title='Dashboard' error={!businessLoading && !config.permissions.MANAGE_LOCATIONS}>
      <Paper variant="outlined" className={classes.box}>
        <ReportingSummary />
        <BusinessSearch
          onSubmit={onChangeSearch}
          categoryOptions={businessSearchCategoryOptions}
          initialCategory="businessName"
          showHealthAuthority={true}
        />
        <BusinessTable
          data={businessList}
          loading={businessLoading}
        />
      </Paper>
    </Page>
  );
}

export default Dashboard;
