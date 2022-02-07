import moment from 'moment';
import { BusinessReportingStatusRO } from 'src/business/ro/busunessReportingStatus.ro';
import { CronConfig } from 'src/cron/config/cron.config';
import { ConfigDates } from 'src/utils/configDates';
import { arrayDifference } from 'src/utils/util';
import { LocationEntity } from '../entities/location.entity';
import { LocationStatus } from '../enums/location-status.enum';
import { ReportStatus } from '../enums/report-status.enum';

export class LocationReportingStatus {
  protected readonly currentReportingStart =
    ConfigDates.getCurrentReportingStartDate();
  private report = new BusinessReportingStatusRO();

  constructor(
    private locations: LocationEntity[],
    private earlyExit?: boolean,
  ) {}

  public check(){
    for(let l of this.locations || []) {

      //Check Missing NOI
      if(this.getNoiReportStatus(l) === ReportStatus.Missing){
        this.report.missingNoi.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Manufacturing Report
      if(this.getManufacturingReportStatus(l) === ReportStatus.Missing){
        this.report.missingManufacturingReport.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Products Report
      if(this.getProductsReportStatus(l) === ReportStatus.Missing){
        this.report.missingProductReport.push(l.id);
        this.report.earlyMissingConfirmed = true;
      }

      //Check Missing Sales Report
      if(this.getSalesReportStatus(l) === ReportStatus.Missing){
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
   * finds out if Noi was not renewed for a active location
   *
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected noiNotRenewed(l: LocationEntity): boolean {
    return (
      l.noi &&
      !moment(l.noi.renewed_at || l.noi.created_at).isAfter(
        CronConfig.getNoiExpiryDate(),
      ) &&
      l.status === LocationStatus.Active
    );
  }

  /**
   * finds out if the location was closed before last reporting year
   *
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected closedBeforeLastReportingYear(l: LocationEntity): boolean {
    return (
      l.status === LocationStatus.Closed &&
      moment(l.closedAt).isBefore(
        this.currentReportingStart.subtract(1, 'year'),
      )
    );
  }

  /**
   * Checks if noi was created after the start of this reporting year.
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected noiCreatedAfterThisReportingStart(l: LocationEntity): boolean {
    return (
      l.noi && moment(l.noi.created_at).isAfter(this.currentReportingStart)
    );
  }

  /**
   * checks if functions should quit early
   * ie. a confirmed missing report is found and earlyExit flag is on.
   */
  protected checkEarlyExit() {
    return this.report.earlyMissingConfirmed && this.earlyExit;
  }

  /**
   * Gets the Reporting status of Noi for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  protected getNoiReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(this.closedBeforeLastReportingYear(l)){
      result = ReportStatus.NotRequired;
    }else if(!l.noi || this.noiNotRenewed(l)){
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * Gets the Reporting status of Manufacturing for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  protected getManufacturingReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(this.closedBeforeLastReportingYear(l) || !l.manufacturing){
      result = ReportStatus.NotRequired;
    }else if(l.manufacturing && !l.manufacturesCount){
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * Gets the Reporting status of Products for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  protected getProductsReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(this.closedBeforeLastReportingYear(l)){
      result = ReportStatus.NotRequired;
    }else if(!l.productsCount){
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * Gets the Reporting status of Sales for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  protected getSalesReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if(this.closedBeforeLastReportingYear(l) || this.noiCreatedAfterThisReportingStart(l)){
      result = ReportStatus.NotRequired;
    }else if(!l.salesCount){
      result = ReportStatus.Missing;
    }
    return result;
  }
}
