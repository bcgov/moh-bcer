import { BusinessList, BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import { GeneralUtil } from '@/util/general.util';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet } from './axios';
import store from 'store';

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

  const getInitialState = () => {
    const user_ha = store.get('KEYCLOAK_USER_HA') || '';
    const initialState = {
      search: '',
      category: '',
      healthAuthority: user_ha,
      additionalFilter: 'all',
    }    
    
    const filterParams = JSON.parse(localStorage.getItem('searchOptions'));

    if (filterParams) {
      if (user_ha) {
        filterParams.healthAuthority = user_ha;
      }

      return filterParams
    }

    return initialState;
  }

  const [searchOptions, setSearchOptions] = useState<SearchQueryBuilder>(getInitialState());

  const [{data: businessData, error: businessError, loading: businessLoading}, getBusinesses] = useAxiosGet<{data: BusinessRO[], count: number}>('/data/business/businesses', { manual: true });

  function onChangeSearch(queryOptions: Partial<SearchQueryBuilder>){
    setSearchOptions({
      ...searchOptions,
      ...queryOptions,
    });    
  }

  useEffect(() => {
    localStorage.setItem('searchOptions', JSON.stringify(searchOptions));
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
  
  const clearAllFilters = () => {
    setSearchOptions({
      search: '',
      category: 'businessName',
      healthAuthority: 'all',
      additionalFilter: 'all',
    })
  }

  return ({
    businessList,
    businessLoading,
    businessError,
    onChangeSearch,
    searchOptions,
    clearAllFilters
  });
}

export default useBusiness;
