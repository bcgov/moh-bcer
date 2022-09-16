import { BusinessList, BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import { GeneralUtil } from '@/util/general.util';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet } from './axios';

export enum BusinessFilter {
  All = 'all',
  Completed = 'completed',
  NotCompleted = 'notCompleted'
}

function useBusiness() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const [businessList, setBusinessList] = useState<BusinessList>({
    all: [],
    completed: [],
    notCompleted: [],
    total: 0,
  });

  const [searchOptions, setSearchOptions] = useState<SearchQueryBuilder>({
    search: '',
    category: '',
    healthAuthority: '',
    additionalFilter: 'all',
  })
  const [{data: businessData, error: businessError, loading: businessLoading}, getBusinesses] = useAxiosGet<{data: BusinessRO[], count: number}>('/data/business/businesses', { manual: true });

  function onChangeSearch(queryOptions: Partial<SearchQueryBuilder>){
    setSearchOptions({
      ...searchOptions,
      ...queryOptions,
    });
  }


  useEffect(() => {
    const query = GeneralUtil.searchQueryBuilder(searchOptions);
    getBusinesses({ url: `/data/business/businesses?${query}`});
  }, [searchOptions])

  useEffect(() => {
    if(businessData?.data){
      const completed = businessData.data?.filter(b => b.reportingStatus?.incompleteReports?.length === 0) || [];
      const notCompleted = businessData.data?.filter(b => b.reportingStatus?.incompleteReports?.length) || [];
      setBusinessList({
        all: businessData.data || [],
        notCompleted,
        completed,
        total: businessData.count
      })
    }
  }, [businessData])

  useEffect(() => {
    if(businessError){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(businessError),
      })
    }
  }, [businessError])
  
  return ({
    businessList,
    businessLoading,
    businessError,
    onChangeSearch,
    searchOptions,
  });
}

export default useBusiness;
