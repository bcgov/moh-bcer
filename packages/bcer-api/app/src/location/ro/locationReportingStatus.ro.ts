import { ReportStatus } from "../enums/report-status.enum";

export class LocationReportingStatusRO {
  noi: ReportStatus;
  manufacturingReport: ReportStatus;
  productReport: ReportStatus;
  salesReport: ReportStatus;

  constructor(){
    this.noi = ReportStatus.Missing;
    this.manufacturingReport = ReportStatus.Missing;
    this.productReport = ReportStatus.Missing;
    this.salesReport = ReportStatus.Missing;
  }
}