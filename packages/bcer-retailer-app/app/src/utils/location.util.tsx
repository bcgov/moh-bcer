import React from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CreateIcon from '@material-ui/icons/Create';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NoMeetingRoomOutlinedIcon from '@material-ui/icons/NoMeetingRoomOutlined';

import {
  BusinessLocationHeaders,
  DateFormat,
  LocationClosingWindow,
  LocationStatus,
  NoiStatus,
} from '@/constants/localEnums';
import { BusinessLocation, TableColumn } from '@/constants/localInterfaces';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import moment from 'moment';
import { StyledTableColumn, StyledToolTip } from 'vaping-regulation-shared-components';
import { GeneralUtil } from './util';

export type LocationBaseColumnType = {
  address1: TableColumn,
  address2: TableColumn,
  city: TableColumn,
  doingBusinessAs: TableColumn,
  postal: TableColumn,
  phone: TableColumn,
  email: TableColumn,
  healthAuthority: TableColumn,
  minor: TableColumn,
  manufacturing: TableColumn,
}

export type LocationBaseColumnsHeader = keyof LocationBaseColumnType;

export class LocationUtil {
  static isClosed(l: BusinessLocation): boolean {
    return l.status === LocationStatus.Closed;
  }

  static renderAddressLine1(l: BusinessLocation): React.ReactNode {
    return <StyledTableColumn value={l.addressLine1} />;
  }

  static renderFullAddress(l: BusinessLocation) {
    return <StyledTableColumn value={`${l.addressLine1}, ${l.city}, ${l.postal}`} />
  }

  static renderCity(l: BusinessLocation): React.ReactNode {
    return <StyledTableColumn value={l.city} />;
  }

  static renderPostalCode(l: BusinessLocation): string {
    return `${l.postal}`;
  }

  static renderLocation(l: BusinessLocation): string {
    return `${l.addressLine1}, ${l.postal}, ${l.city}`;
  }

  static renderDoingBusinessAs(l: BusinessLocation): React.ReactNode {
    return <StyledTableColumn value={l.doingBusinessAs} length={20}/>;
  }

  static renderEmail(l: BusinessLocation): React.ReactNode {
    return <StyledTableColumn value={l.email} />
  }

  static renderCreationDate(l: BusinessLocation) {
    return (
      <StyledToolTip title={GeneralUtil.getFormattedTime(l.created_at, DateFormat.hh_mm_ss_a, true)}>
        <Box>
          {GeneralUtil.getFormattedDate(l.created_at, DateFormat.MMM_DD_YYYY, true)}
        </Box>
      </StyledToolTip>
    )
  }

  static renderStatus(l: BusinessLocation) {
    const { status } = l;
    const colorMap: any = {
      [LocationStatus.Active]: '#16C92E',
      [LocationStatus.Closed]: '#FFC300',
    };
    let statusDetails = {
      text: status,
      color: colorMap[status],
    };

    return (
      <Box display="flex" alignItems="center">
        <FiberManualRecordIcon htmlColor={statusDetails.color} />
        <Box ml={1} style={{ textTransform: 'capitalize' }}>
          {statusDetails.text}
        </Box>
      </Box>
    );
  }

  static renderActions(handleAction: {
    handleEdit: Function;
    handleClose: Function;
    handleDelete: Function;
    handleView: Function;
  }) {
    return function (l: BusinessLocation) {
      const disabledColor = '#CDCED2';
      const isEditDisabled: boolean = LocationUtil.isClosed(l) || l?.noi?.status === NoiStatus.Submitted;
      return (
        <>
        {
          isEditDisabled
            ?
          <Tooltip title="View Location" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
              }}
              onClick={() => {
                handleAction.handleView(l);
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>
            :
          <Tooltip title="Edit Location" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
              }}
              onClick={() => {
                handleAction.handleEdit(l);
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>
        }
          <Tooltip title="Close Location" placement="top">
            <IconButton
              style={{
                color: LocationUtil.isClosed(l) ? disabledColor : '#F5A623',
              }}
              onClick={() => {
                handleAction.handleClose(l);
              }}
              disabled={LocationUtil.isClosed(l)}
            >
              <NoMeetingRoomOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Location" placement="top">
            <IconButton
              style={{
                color: LocationUtil.isClosed(l) ? disabledColor : '#FE6B63',
              }}
              onClick={() => {
                handleAction.handleDelete(l);
              }}
              disabled={LocationUtil.isClosed(l)}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    };
  }

  static renderNewLocationActions(handleAction: {
    handleEdit: Function;
    handleDelete: Function;
  }) {
    return function (l: IBusinessLocationValues) {
      return (
        <div>
          <Tooltip title="Editing Location" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
                marginLeft: '-0.5rem',
              }}
              onClick={() => {
                handleAction.handleEdit(l);
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deleting Location" placement="top">
            <IconButton
              style={{
                color: '#FE6B63',
                marginLeft: '-0.5rem',
              }}
              onClick={() => {
                handleAction.handleDelete(l);
              }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    };
  }

  static getCsvProp(data: ReadonlyArray<BusinessLocation>, filename: string) {
    if (filename.indexOf('.csv') + 4 !== filename.length) {
      filename = `${filename}.csv`;
    }
    return {
      data: data.reduce((dataList: Array<any>, l: BusinessLocation) => {
        dataList.push([
          l.addressLine1,
          l.postal,
          l.city,
          l.email,
          l.phone,
          l.underage,
          l.health_authority,
          l.doingBusinessAs,
          l.manufacturing,
        ]);
        return dataList;
      }, []),
      headers: Object.keys(BusinessLocationHeaders),
      filename,
    };
  }

  /**
   * function to calculate the location closing window for the current year
   * use case example:
   * Current date = October 2nd, 2021. Component should allow me to choose date between Oct 1st, 2021 and Sept 30, 2022
   * Current date = August 25th, 2022. Component should allow me to choose date between Oct 1st, 2021 and Sept 30, 2022
   * @returns {min: least date when location can be closed, max: max date when location can be closed}
   */

  static getLocationCloseWindow(): {max: Date, min: Date} {
    let minYear = new Date().getFullYear();
    if(new Date().getMonth() < 8){
      minYear -= 1;
    }
    return ({
      max: moment(`${minYear+1}-${LocationClosingWindow.Max}`, 'YYYY-MM-DD').toDate(),
      min: moment(`${minYear}-${LocationClosingWindow.Min}`, 'YYYY-MM-DD').toDate(),
    })
  }

  private static readonly locationTableBaseColumns: LocationBaseColumnType = {
    address1: {title: 'Address 1', render: LocationUtil.renderAddressLine1, width: 150},
    address2: {title: 'Address 2', field: 'addressLine2', width: 150},
    postal: {title: 'Postal Code', field: 'postal', width: 150},
    city: {title: 'City', render: LocationUtil.renderCity, width: 150},
    phone: {title: 'Business Phone', field: 'phone', width: 150},
    email: {title: 'Business email', render: LocationUtil.renderEmail, width: 150},
    healthAuthority: {title: 'Health Authority', field: 'health_authority', width: 150},
    doingBusinessAs: {title: 'Doing Business As', render: LocationUtil.renderDoingBusinessAs, width: 150},
    minor: {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`, width: 150},
    manufacturing: {title: 'Manufacturing  Premises', field: 'manufacturing', width: 200},
  }

  static getTableColumns(list: LocationBaseColumnsHeader[] = ['address1', 'postal', 'city', 'phone', 'email', 'healthAuthority', 'doingBusinessAs', 'minor', 'manufacturing' ]){
    let columns: TableColumn[] = [];
    list?.forEach(l => columns.push(this.locationTableBaseColumns[l]));
    return columns;
  }
}
