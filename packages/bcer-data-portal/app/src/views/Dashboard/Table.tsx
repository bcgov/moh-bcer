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
  return (
    <Box>
      <StyledTable
        columns={DashboardUtil.tableColumn}
        data={data}
        options={{
          pageSize: 20,
          pageSizeOptions: [20, 30, 50],
        }}
        {...props}
      />
    </Box>
  );
}

export default Table;
