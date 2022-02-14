import React from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CreateIcon from '@material-ui/icons/Create';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NoMeetingRoomOutlinedIcon from '@material-ui/icons/NoMeetingRoomOutlined';

import {
  BusinessLocationHeaders,
  LocationClosingWindow,
  LocationStatus,
  NoiStatus,
} from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import moment from 'moment';

export class LocationUtil {
  static isClosed(l: BusinessLocation): boolean {
    return l.status === LocationStatus.Closed;
  }

  static renderAddressLine1(l: BusinessLocation): string {
    return `${l.addressLine1}`;
  }

  static renderCity(l: BusinessLocation): string {
    return `${l.city}`;
  }

  static renderPostalCode(l: BusinessLocation): string {
    return `${l.postal}`;
  }

  static renderLocation(l: BusinessLocation): string {
    return `${l.addressLine1}, ${l.postal}, ${l.city}`;
  }

  static renderDoingBusinessAs(l: BusinessLocation): string {
    return `${l.doingBusinessAs}`;
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
}
