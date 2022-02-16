import { BusinessReportingStatusRO } from "src/business/ro/businessReportingStatus.ro";
import { arrayDifference } from "src/utils/util";
import { LocationEntity } from "../entities/location.entity";
import { ReportStatus } from "../enums/report-status.enum";
import { SingleLocationComplianceStatus } from "./singleLocationComplianceStatus";
import { SingleLocationReportStatus } from "./singleLocationReportStatus";

export class ReportBaseClass {
  private report = new BusinessReportingStatusRO();

  constructor(
    private locations: LocationEntity[],
    private service: SingleLocationComplianceStatus | SingleLocationReportStatus,
    private earlyExit?: boolean,
  ) {}

  public check(){
    for(let l of this.locations || []) {

      const report = this.service.getStatus(l);

      //Check Missing NOI
      if(report.noi === ReportStatus.Missing){
        this.report.missingNoi.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Manufacturing Report
      if(report.manufacturingReport === ReportStatus.Missing){
        this.report.missingManufacturingReport.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Products Report
      if(report.productReport === ReportStatus.Missing){
        this.report.missingProductReport.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Sales Report
      if(report.salesReport === ReportStatus.Missing){
        this.report.missingSalesReport.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      if(this.checkEarlyExit()){
        break;
      }
    }
    return this;
  }

  /**
   * checks if location reporting is complete/incomplete
   * and adds the location id to respective array.
   */
  private assignCompleted() {
    this.report.incompleteReports = [
      ...new Set([
        ...this.report.missingNoi,
        ...this.report.missingManufacturingReport,
        ...this.report.missingProductReport,
        ...this.report.missingSalesReport,
      ]),
    ];
    this.report.completeReports = arrayDifference(
      this.locations.map((l) => l.id),
      this.report.incompleteReports,
    );
    return this;
  }
  
  /**
   * Returns this.result (submission status report)
   * 
   * @returns `BusinessReportingStatusRO`
   */
  public build() {
    if (this.checkEarlyExit()) {
      return this.report;
    }
    this.assignCompleted();
    return this.report;
  }
 

  /**
   * checks if functions should quit early
   * ie. a confirmed missing report is found and earlyExit flag is on.
   */
  protected checkEarlyExit() {
    return this.report.earlyMissingConfirmed && this.earlyExit;
  }
}