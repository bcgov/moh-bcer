import React from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { BusinessLocationHeaders, LocationStatus, NoiStatus, NoiStatusHeaders } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { Box, Grid, Typography } from '@material-ui/core';
import moment from 'moment';

export class NoiUtil {
  static outstandingNoi(l: BusinessLocation): boolean {
    return (
      l.status === LocationStatus.ACTIVE && (!l.noi || l.noi?.status === NoiStatus.NOT_RENEWED)
    );
  }

  static submittedNoi(l: BusinessLocation): boolean {
    return l.noi && (l.noi.status === NoiStatus.SUBMITTED || (l.status == LocationStatus.CLOSED));
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

  static renderSubmittedDate(l: BusinessLocation): string {
    return l.noi?.created_at
      ? `${moment(l.noi.created_at).format('MMM DD, YYYY')}`
      : '';
  }

  static renderDoingBusinessAs(l: BusinessLocation): string {
    return `${l.doingBusinessAs}`;
  }

  static renderStatus(l: BusinessLocation) {
    const {noi, status} = l;
    let statusDetails = {text: '', color: ''};
    if(noi && noi.status === NoiStatus.SUBMITTED && status === LocationStatus.ACTIVE){
      statusDetails = { text: NoiStatusHeaders.SUBMITTED, color: 'green' };
    }else if(noi && status === LocationStatus.CLOSED){
      statusDetails = { text: NoiStatusHeaders.NOT_REQUIRED, color: 'grey'};
    }else if(noi && noi.status === NoiStatus.NOT_RENEWED && status === LocationStatus.ACTIVE){
      statusDetails = { text: NoiStatusHeaders.NOT_RENEWED, color: 'red' };
    }else if(!noi){
      statusDetails = { text: NoiStatusHeaders.NOT_SUBMITTED, color: '#FFC300' };
    }
        
    return (
      <Box display="flex" alignItems="center">
        <FiberManualRecordIcon htmlColor={statusDetails.color} />
        <Box ml={1}>{statusDetails.text}</Box>
      </Box>
    );
  }

  static getCsvProp(data: ReadonlyArray<BusinessLocation>, filename: string) {
    if(filename.indexOf('.csv') + 4 !== filename.length){
        filename = `${filename}.csv`;
    }
    return {
      data: data.reduce((dataList: Array<any>, l: BusinessLocation) => {
        dataList.push([
          l.addressLine1,
          l.addressLine2,
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
}
