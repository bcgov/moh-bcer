import BusinessSearch from '@/components/generic/BusinessSearch';
import Page from '@/components/generic/Page';
import { businessSearchCategoryOptions } from '@/constants/arrays';
import { ConfigContext } from '@/contexts/Config';
import useBusiness from '@/hooks/useBusiness';
import { LinearProgress, Paper, styled } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import BusinessTable from './BusinessTable';
import ReportingSummary from './ReportingSummary';

const PaperBox = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
});


function Dashboard() {
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
    onChangeSearch({ 
      pageSize: 5,
      page: 0,
      reports: 'all' 
    });
  }, []);

  return (
    <Page title='Dashboard' error={!businessLoading && !config.permissions.MANAGE_LOCATIONS}>
      <PaperBox variant="outlined">
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
      </PaperBox>
    </Page>
  );
}

export default Dashboard;
