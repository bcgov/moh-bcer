import Page from '@/components/generic/Page';
import { UserDetails } from '@/constants/localInterfaces';
import useUserManagement from '@/hooks/useUserManagement';
import { UserManagementUtil } from '@/util/userManagement.util';
import { Box } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  StyledButton,
  StyledSelectField,
  StyledTextField,
} from 'vaping-regulation-shared-components';
import EditDialog from './EditDialog';
import UserTable from './UserTable';
import SearchIcon from '@material-ui/icons/Search';

function UserManagement() {
  const {
    getUserData,
    getBusinessData,
    users,
    userLoading,
    userError,
    businesses,
    updateUser,
    openEditDialog,
    setOpenEditDialog,
    patchUserLoading,
    mergeBusinessLoading,
  } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<UserDetails>();

  const openEdit = (u: UserDetails) => {
    setSelectedUser(u);
    setOpenEditDialog(true);
  };

  return (
    <Page title="User Management" error={userError}>
      <>
        <Formik
          onSubmit={getUserData}
          initialValues={UserManagementUtil.getUserSearchInitialValues()}
        >
          <Form>
            <Box display="flex">
              <Box flex={0.15}>
                <StyledSelectField
                  name="type"
                  variant="outlined"
                  options={UserManagementUtil.userSearchOptions}
                />
              </Box>
              <Box flex={0.71}>
                <StyledTextField
                  variant="outlined"
                  name="search"
                  placeholder="Search (User Name, Business Name, Address, Email Address)"
                  style={{ paddingLeft: '20px' }}
                />
              </Box>
              <Box flex={0.01} />
              <Box flex={0.13}>
                <StyledButton variant="dialog-accept" type="submit">
                  <SearchIcon />
                  <Box mr={1} />
                  Search
                </StyledButton>
              </Box>
            </Box>
          </Form>
        </Formik>
        <UserTable data={users} editHandler={openEdit} loading={userLoading} />
        {openEditDialog && (
          <EditDialog
            businessData={businesses}
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            targetUser={selectedUser}
            submitHandler={updateUser}
            buttonLoading={patchUserLoading || mergeBusinessLoading}
          />
        )}
      </>
    </Page>
  );
}

export default UserManagement;
