import { BusinessRO, SearchQueryBuilder } from '@/constants/localInterfaces';
import { DashboardUtil } from '@/util/dashboard.util';
import { Box } from '@material-ui/core';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

export interface TableProps {
  data: BusinessRO[],
  [x: string]: unknown,
}

function Table({
  data,
  ...props
}: TableProps) {

  const getInitialPagination = () => {
    if (data.length <= 5) {
      return 5
    } else if (data.length <= 10) {
      return 10
    } else return 20
  }

  return (
    <Box>
      <StyledTable
        columns={DashboardUtil.tableColumn}
        data={data}
        options={{
          pageSize: getInitialPagination(),
          pageSizeOptions: [5, 10, 20, 30, 50],
        }}
        {...props}
      />
    </Box>
  );
}

export default Table;
