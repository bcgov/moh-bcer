import { UserDetails, UserSearchFields, UserUpdateFields } from '@/constants/localInterfaces';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


export class UserManagementUtil {
  static readonly userSearchOptions = [
    { value: 'userName', label: 'User Name' },
    { value: 'businessName', label: 'Business Name' },
    { value: 'address', label: 'Address' },
    { value: 'emailAddress', label: 'Email Address' },
  ];

  static getUserSearchInitialValues(): UserSearchFields {
    return {
      search: '',
      type: 'userName',
    };
  }

  static getUserUpdateInitialValues(selectedUser: UserDetails): UserUpdateFields {
    return {
      active: true,
      selectedBusiness: null,
      confirmed: false,
      mergeData: true,
      user: selectedUser,
    }
  }

  static getColumns(editHandler: Function) {
    return [
      {
        title: 'User Name',
        render: this.renderName,
      },
      {
        title: 'BCeID',
        field: 'bceidUser',
      },
      {
        title: 'Business Name',
        render: this.renderBusinessName,
      },
      {
        title: 'Address',
        field: 'business.addressLine1',
      },
      {
        title: 'Email Address',
        field: 'email',
      },
      {
        title: 'Status',
        render: this.renderStatus,
      },
      {
        render: this.renderEdit(editHandler),
      },
    ];
  }

  static renderName(u: UserDetails) {
    return `${u.firstName || ''} ${u.lastName || ''}`;
  }

  static renderBusinessName(u: UserDetails) {
    return u?.business?.businessName || u?.business?.legalName;
  }

  static renderStatus(u: UserDetails) {
    return(
      <Box display="flex" alignItems="center">
        <FiberManualRecordIcon htmlColor={'green'} />
        <Box ml={1}>{"Active"}</Box>
      </Box>
    )
  }

  static renderEdit(editHandler: Function) {
    return function (u: UserDetails) {
      return (
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="Edit User" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
              }}
              onClick={() => editHandler(u)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    };
  }
}
