import { AccordionSummaryProps} from "@mui/material";
import { ReportStatus } from "../enums/genericEnums";

export interface StyledWarningProps {
  text: string,
  rootProps?: any,
  textProps?: any,
  iconProps?: any,
}

export type AccordionGroupProps = {
  options: Array<{
    title: string;
    description: string;
    id: string;
  }>,
  isEditable?: boolean,
  isDeletable?: boolean,
  editCallback?: Function,
  deleteCallback?: Function,
}
export type AccordionSingleProps = {
  content: {
    title: string;
    description: string;
    id: string;
  },
  expandedId: string,
  expandCallback: Function,
  isEditable?: boolean,
  isDeletable?: boolean,
  editCallback?: Function,
  deleteCallback?: Function,
}

export type StyledAccordionSummaryProps = AccordionSummaryProps & {
  isEditable?: boolean,
  isDeletable?: boolean,
  editCallback?: Function,
  deleteCallback?: Function,
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
  location_type: string;
  health_authority: string;
  health_authority_other: string;
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