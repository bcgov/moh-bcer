import BusinessSearch from '@/components/generic/BusinessSearch';
import Page from '@/components/generic/Page';
import { businessSearchCategoryOptions } from '@/constants/arrays';
import { ConfigContext } from '@/contexts/Config';
import useBusiness from '@/hooks/useBusiness';
import { LinearProgress, makeStyles, Paper } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
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
    businessLoading,
    onChangeSearch,
    clearAllFilters,
    totalRowCount,
    searchOptions
  } = useBusiness();

  // resets values on refresh
  useEffect(() => {
    console.log('resetting search options')
    onChangeSearch({ 
      pageSize: 5,
      page: 0,
      reports: 'all' 
    });
  }, []);

  return (
    <Page title='Dashboard' error={!businessLoading && !config.permissions.MANAGE_LOCATIONS}>
      <Paper variant="outlined" className={classes.box}>
        <ReportingSummary />
        <BusinessSearch
          onSubmit={onChangeSearch}
          categoryOptions={businessSearchCategoryOptions}
          initialCategory="businessName"
          showHealthAuthority={true}
          onReset = {clearAllFilters}
        />
        <BusinessTable
          data={businessList}
          loading={businessLoading}
          onChangeSearch={onChangeSearch}
          totalRowCount={totalRowCount}
          searchOptions={searchOptions}
        />
      </Paper>
    </Page>
  );
}

export default Dashboard;
