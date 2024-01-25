import { BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { DashboardUtil } from '@/util/dashboard.util';
import useBusiness from '@/hooks/useBusiness';
import { getInitialPagination } from '@/util/general.util';
import { Box } from '@material-ui/core';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

export interface TableProps {
  data: BusinessRO[];
}

function Table({
  data,
  ...props
}: TableProps) {

  const {
    totalRowCount,
    searchOptions,
    onChangeSearch,
  } = useBusiness();

  return (
    <Box>
      <StyledTable
        columns={DashboardUtil.tableColumn}
        data={data}
        options={{
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50],
          sorting: true
        }}
        onChangePage={(page: number) => {
          onChangeSearch({
            page: page,
          });
        }}
        onChangeRowsPerPage={(rowsPerPage: number) => {
          onChangeSearch({
            pageSize: rowsPerPage,
          });
        }}
        onOrderChange={(orderColumn: number, orderDirection: any) => {
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
        }}
        page={searchOptions.page}
        totalCount={totalRowCount}
        {...props}
      />
    </Box>
  );
}

export default Table;