import { LocationEntity } from "../entities/location.entity";
import { ReportStatus } from "../enums/report-status.enum";
import { SingleLocationReportStatus } from "./singleLocationReportStatus";

export class SingleLocationComplianceStatus extends SingleLocationReportStatus {
  getNoiReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(!l.noi || this.closedBeforeLastReportingYear(l)){
      result = ReportStatus.NotRequired;
    }else if(l.noi && this.noiNotRenewed(l)){
      result = ReportStatus.Missing;
    }
    return result;
  }

  getManufacturingReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(!l.noi || this.closedBeforeLastReportingYear(l) || !l.manufacturing || this.noiCreatedAfterThisReportingStart(l)){
      result = ReportStatus.NotRequired;
    }else if(!l.manufacturesCount){
      result = ReportStatus.Missing;
    }
    return result;
  }

  getProductsReportStatus(l: LocationEntity): ReportStatus {
      let result = ReportStatus.Reported;
      if(!l.noi || this.noiCreatedAfterThisReportingStart(l) || this.closedBeforeLastReportingYear(l)){
        result = ReportStatus.NotRequired;
      }else if(!l.productsCount){
        result = ReportStatus.Missing;
      }
      return result;
  }

  getSalesReportStatus(l: LocationEntity): ReportStatus {
      let result = ReportStatus.Reported;
      if(!l.noi || this.noiCreatedAfterThisReportingStart(l) || this.closedBeforeLastReportingYear(l)){
        result = ReportStatus.NotRequired;
      }else if(!l.salesCount){
        result = ReportStatus.Missing;
      }
      return result;
  }
}