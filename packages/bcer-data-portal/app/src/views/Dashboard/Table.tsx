import { BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { DashboardUtil } from '@/util/dashboard.util';
import { Box } from '@mui/material';
import { getInitialPagination } from '@/util/general.util';
import React, { useEffect, useCallback, useRef } from 'react';
import { Query, QueryResult } from '@material-table/core';
import { StyledTable } from 'vaping-regulation-shared-components';

export interface TableProps {
  data: BusinessRO[];
  onChangeSearch: Function;
  totalRowCount: number;
  searchOptions: SearchQueryBuilder;
}

function Table({
  data,
  onChangeSearch,
  totalRowCount,
  searchOptions,
  ...props
}: TableProps) {
  const tableRef = useRef<any>(); //rerender the table when data is updated

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.onQueryChange();
    }
  }, [data]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    onChangeSearch({
      ...searchOptions,
      page: newPage,
      pageSize: newPageSize,
    });
  };

  const handleColumnChange = (orderColumn: number, orderDirection: any) => {
    if (orderColumn === -1) {
      onChangeSearch({
        orderBy: undefined,
        orderDirection: undefined
      })
      return;
    }
    onChangeSearch({
      orderBy: DashboardUtil.tableColumn[orderColumn].sortTitle,
      orderDirection: orderDirection.toUpperCase()
    })
  };

  const fetchData = useCallback((query: Query<BusinessRO>): Promise<QueryResult<BusinessRO>> =>
    new Promise((resolve) => {
      resolve({
        data: data,
        page: searchOptions.page,
        totalCount: totalRowCount,
      });
    })
  , [data, searchOptions.page, totalRowCount]);

  return (
    <Box>
      <StyledTable
        tableRef={tableRef}
        columns={DashboardUtil.tableColumn}
        data={fetchData}
        options={{
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50],
          sorting: true
        }}
        onPageChange={handlePageChange} //page change and page size change
        onOrderChange={handleColumnChange} //column drag and sorting
        {...props}
      />
    </Box>
  );
}

export default Table;