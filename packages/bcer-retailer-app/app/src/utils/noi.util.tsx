import React from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  BusinessLocationHeaders,
  DateFormat,
  LocationStatus,
  NoiStatus,
  NoiStatusHeaders,
  ReportStatus,
} from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { ClassNameMap } from '@mui/material/styles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { GeneralUtil } from './util';
import { LocationType, LocationTypeLabels } from 'vaping-regulation-shared-components';

export class NoiUtil {
  static outstandingNoi(l: BusinessLocation): boolean {
    return (
      l.status === LocationStatus.Active &&
      (!l.noi || l.noi?.status === NoiStatus.NotRenewed) &&
      (l.reportStatus?.salesReport !== ReportStatus.Missing)
    );
  }

  static missingSalesReport(l: BusinessLocation): boolean {
    return (
      l.status === LocationStatus.Active &&
      (!l.noi || l.noi?.status === NoiStatus.NotRenewed) &&
      (l.reportStatus?.salesReport === ReportStatus.Missing)
    )
  }

  static submittedNoi(l: BusinessLocation): boolean {
    return (
      l.noi &&
      (l.noi.status === NoiStatus.Submitted ||
        l.status == LocationStatus.Closed)
    );
  }

  static renderAddressLine1(l: BusinessLocation): string {
    return `${l.location_type === LocationType.online ? l.webpage: l.addressLine1}`;
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
    return updated ? moment(updated).format('MMM DD, YYYY') : '';
  }

  static renderStatus(l: BusinessLocation) {
    const { noi, status } = l;
    let statusDetails = { text: '', color: '' };
    if (
      noi &&
      noi.status === NoiStatus.Submitted &&
      status === LocationStatus.Active
    ) {
      statusDetails = { text: NoiStatusHeaders.Submitted, color: 'green' };
    } else if (noi && status === LocationStatus.Closed) {
      statusDetails = { text: NoiStatusHeaders.NotRequired, color: 'grey' };
    } else if (
      noi &&
      noi.status === NoiStatus.NotRenewed &&
      status === LocationStatus.Active
    ) {
      statusDetails = { text: NoiStatusHeaders.NotRenewed, color: '#FFC300' };
    } else if (!noi) {
      statusDetails = { text: NoiStatusHeaders.NotSubmitted, color: 'red' };
    }

    return (
      <Box display="flex" alignItems="center">
        <FiberManualRecordIcon htmlColor={statusDetails.color} />
        <Box ml={1}>{statusDetails.text}</Box>
      </Box>
    );
  }

  static renderAction(handleDownload: Function) {
    return function (l: BusinessLocation) {
      const disabled = l?.status === LocationStatus.Closed;
      return (
        <Box display='flex' justifyContent='center'>
          <Tooltip title="Download/Print PDF" placement="top">
            <IconButton
              style={{
                color: disabled ? '#ccc' : '#0053A5',
              }}
              onClick={() => handleDownload(l)}
              disabled={disabled}
              size="large">
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
}

interface ResponsiveClass {
  header: string;
  bodyWrapper: string;
  infoWrapper: string;
  infoLabel: string;
  infoData: string;
  bottomTextWrapper: string
}

export class NoiPdfUtil {
  private totalCharacters: number = 0;
  private responsiveClass: ResponsiveClass;

  constructor(
    location: BusinessLocation,
    legalName: string,
    classes: ClassNameMap
  ) {
    this.calculateTotalCharacters(location, legalName);
    this.assignVersion(classes);
  }

  private calculateTotalCharacters(data: BusinessLocation, legalName: string) {
    this.totalCharacters += data.addressLine1?.length || 0;
    this.totalCharacters += data.city?.length || 0;
    this.totalCharacters += data.doingBusinessAs?.length || legalName?.length || 0;
    this.totalCharacters += data.postal?.length || 0;
    this.totalCharacters += data.underage_other?.length || 0;
    this.totalCharacters += legalName?.length || 0;
  }

  private assignV1Style(classes: ClassNameMap) {
    this.responsiveClass = {
      header: classes.header,
      bodyWrapper: classes.bodyWrapper,
      infoWrapper: classes.infoWrapper,
      infoLabel: classes.infoLabel,
      infoData: classes.infoData,
      bottomTextWrapper: classes.bottomTextWrapper,
    };
  }

  private assignV2Style(classes: ClassNameMap) {
    this.responsiveClass = {
      header: classes.headerV2,
      bodyWrapper: classes.bodyWrapperV2,
      infoWrapper: classes.infoWrapper,
      infoLabel: classes.infoLabelV2,
      infoData: classes.infoDataV2,
      bottomTextWrapper: classes.bottomTextWrapper,
    };
  }

  private assignV3Style(classes: ClassNameMap) {
    this.responsiveClass = {
      header: classes.headerV2,
      bodyWrapper: classes.bodyWrapperV2,
      infoWrapper: classes.infoWrapperV3,
      infoLabel: classes.infoLabelV2,
      infoData: classes.infoDataV3,
      bottomTextWrapper: classes.bottomTextWrapperV3,
    };
  }

  private assignVersion(classes: ClassNameMap) {
    if (this.totalCharacters <= 215) {
      this.assignV1Style(classes);
    } else if (this.totalCharacters <= 475) {
      this.assignV2Style(classes);
    } else {
      this.assignV3Style(classes);
    }
  }

  build() {
    return {
      responsiveClass: this.responsiveClass,
    };
  }

  static formatNoiData(location: BusinessLocation, legalName: string) {
    return {
      businessName: location.doingBusinessAs || legalName,
      legalName,
      address: this.formatAddress(location),
      postal: location.postal?.toLocaleUpperCase(),
      ageRestricted: this.findAgeRestricted(location),
      manufacturing: GeneralUtil.upperCaseFirstLetter(location.manufacturing),
      submissionDate: this.formatSubmissionDate(location),
      renewalDate: this.formatRenewalDate(location),
      expiryDate: this.formatExpiryDate(location),
      effectiveOperationDate: this.formatEffectiveOperationDate(location),
      locationType: location.location_type,
      formattedLocationType: LocationTypeLabels[location.location_type],
      webpage: location.webpage
    };
  }

  static formatAddress(location: BusinessLocation): string {
    let formattedAddress = '';
    formattedAddress += `${location.addressLine1}, `;
    formattedAddress += `${location.city}, `;
    return formattedAddress;
  }

  static findAgeRestricted(location: BusinessLocation): string {
    const underage = location.location_type === LocationType.online ? "No" :
            location.underage === 'other'
              ? location.underage_other
              : location.underage;

    return underage === 'No' ? `${underage } (only 19+)` : underage;
  }

  static formatSubmissionDate(location: BusinessLocation): string {
    return GeneralUtil.getFormattedDate(
      location.noi?.created_at,
      DateFormat.MMMM_DD_YYYY
    );
  }

  static formatRenewalDate(location: BusinessLocation): string {
    return GeneralUtil.getFormattedDate(
      location.noi?.renewed_at,
      DateFormat.MMMM_DD_YYYY
    );
  }

  static formatExpiryDate(location: BusinessLocation): string {
    return GeneralUtil.getFormattedDate(
      location.noi?.expiry_date,
      DateFormat.MMMM_DD_YYYY
    );
  }

  /**
   * A location can operate legally 6 weeks after the original NOI submission date
   * This function calculates the effective date from when businesses can sell vape products at that location
   * 
   * @param {BusinessLocation} location - `BusinessLocation` Business Location Data
   * @returns Formatted Date String.
   */
  static formatEffectiveOperationDate(location: BusinessLocation): string {
    let submissionDate = moment(location.noi?.created_at);
    submissionDate = submissionDate.add(42, 'days');
    return GeneralUtil.getFormattedDate(submissionDate.toDate(), DateFormat.MMMM_DD_YYYY);

  }
}
