import { UserDetails } from '@/constants/localInterfaces';
import { getInitialPagination } from '@/util/general.util';
import { UserManagementUtil } from '@/util/userManagement.util';
import { Box, LinearProgress } from '@material-ui/core';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

interface UserTableProps {
  data: UserDetails[];
  editHandler: Function;
  loading?: boolean;
}

function UserTable({ data, editHandler, loading }: UserTableProps) {

  return (
    <Box>
      {loading && <LinearProgress />}
      <StyledTable
        columns={UserManagementUtil.getColumns(editHandler)}
        data={data}
        options={{
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30],
        }}
      />
    </Box>
  );
}

export default UserTable;
