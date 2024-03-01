import { BusinessList, BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import { GeneralUtil } from '@/util/general.util';
import React, { useContext, useEffect, useState } from 'react';
import { useAxiosGet } from './axios';
import store from 'store';

export enum BusinessFilter {
  All = 'all',
  Completed = 'complete',
  Outstanding = 'outstanding'
}

function useBusiness() {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const [totalRowCount, setTotalRowCount] = useState(0);
  const [businessList, setBusinessList] = useState<BusinessList>([]);

  const getInitialState = () => {
    const user_ha = store.get('KEYCLOAK_USER_HA') || '';
    const initialState = {
      search: '',
      category: '',
      healthAuthority: user_ha,
      additionalFilter: 'all',
      reports: 'all',
      page: 0,
      pageSize: 5
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

  const [{data: businessData, error: businessError, loading: businessLoading}, getBusinesses] = useAxiosGet<{data: BusinessRO[], pageNum: number, totalRows: number}>('/data/business/businesses', { manual: true });

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
      setTotalRowCount(businessData?.totalRows || 0);
      setBusinessList(businessData.data)
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
      reports: 'all',
      additionalFilter: 'all',
      page: 0,
      pageSize: 5
    })
  }

  return ({
    businessList,
    totalRowCount,
    businessLoading,
    businessError,
    onChangeSearch,
    searchOptions,
    clearAllFilters
  });
}

export default useBusiness;
