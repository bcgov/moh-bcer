import React from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { BusinessLocationHeaders, LocationStatus, NoiStatus, NoiStatusHeaders } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { Box, Grid, Typography } from '@material-ui/core';
import moment from 'moment';

export class NoiUtil {
  static outstandingNoi(l: BusinessLocation): boolean {
    return (
      l.status === LocationStatus.Active && (!l.noi || l.noi?.status === NoiStatus.NotRenewed)
    );
  }

  static submittedNoi(l: BusinessLocation): boolean {
    return l.noi && (l.noi.status === NoiStatus.Submitted || (l.status == LocationStatus.Closed));
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

  static renderRenewalOrSubmissionDate(l: BusinessLocation): string {
    let updated = l.noi?.renewed_at ?? l.noi?.created_at;
    return updated ? moment(updated).format('MMM DD, YYYY'): '';
  }

  static renderStatus(l: BusinessLocation) {
    const {noi, status} = l;
    let statusDetails = {text: '', color: ''};
    if(noi && noi.status === NoiStatus.Submitted && status === LocationStatus.Active){
      statusDetails = { text: NoiStatusHeaders.Submitted, color: 'green' };
    }else if(noi && status === LocationStatus.Closed){
      statusDetails = { text: NoiStatusHeaders.NotRequired, color: 'grey'};
    }else if(noi && noi.status === NoiStatus.NotRenewed && status === LocationStatus.Active){
      statusDetails = { text: NoiStatusHeaders.NotRenewed, color: '#FFC300' };
    }else if(!noi){
      statusDetails = { text: NoiStatusHeaders.NotSubmitted, color: 'red' };
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
