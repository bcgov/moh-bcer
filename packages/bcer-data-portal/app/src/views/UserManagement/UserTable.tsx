import { UserDetails } from '@/constants/localInterfaces';
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

  const getInitialPagination = () => {
    if (data.length <= 5) {
      return 5
    } else if (data.length <= 10) {
      return 10
    } else return 20
  }

  return (
    <Box>
      {loading && <LinearProgress />}
      <StyledTable
        columns={UserManagementUtil.getColumns(editHandler)}
        data={data}
        options={{
          pageSize: getInitialPagination(),
          pageSizeOptions: [5, 10, 20, 30],
        }}
      />
    </Box>
  );
}

export default UserTable;
