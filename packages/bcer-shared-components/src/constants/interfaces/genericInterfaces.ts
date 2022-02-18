import { StyledProps } from "@material-ui/core";
import { ReportStatus } from "../enums/genericEnums";

export interface StyledWarningProps {
  text: string,
  rootProps?: any,
  textProps?: any,
  iconProps?: any,
}

export type LocationRO = {
  id: string;
  email: string;
  webpage: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postal: string;
  phone: string;
  underage: string;
  ha: string;
  ha_other: string;
  doingBusinessAs: string;
  manufacturing: boolean;
  created_at: string;
  updated_at: string;
  deletedAt: string;
  businessId: string;
  status: string;
  closedAt: string;
  closedTime: string;
  geoAddress: string;
  geoAddressId: string;
  longitude: string;
  latitude: string;
  geoAddressConfidence: string;
  reportStatus?: LocationReportStatus;
}

export interface LocationReportStatus {
  noi: ReportStatus;
  manufacturingReport: ReportStatus;
  productReport: ReportStatus;
  salesReport: ReportStatus;
}

export interface BusinessReportStatus {
  completeReports: string[];
  incompleteReports: string[];
  missingNoi: string[];
  missingProductReport: string[];
  missingSalesReport: string[];
  missingManufacturingReport: string[];
  earlyMissingConfirmed: boolean;
}