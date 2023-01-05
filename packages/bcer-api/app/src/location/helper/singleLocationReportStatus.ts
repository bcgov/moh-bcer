import moment from 'moment';
import { ConfigDates } from 'src/utils/configDates';
import { LocationEntity } from '../entities/location.entity';
import { LocationStatus } from '../enums/location-status.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { LocationReportingStatusRO } from '../ro/locationReportingStatus.ro';
import { getSalesReportingPeriod } from 'src/common/common.utils';

export class SingleLocationReportStatus {
  protected readonly currentReportingStart =
    ConfigDates.getCurrentReportingStartDate();
  protected result: LocationReportingStatusRO = new LocationReportingStatusRO();

  /**
   *
   * @param l `LocationEntity` with productCount, salesCount and manufacturingCount available*
   */
  getStatus(l: LocationEntity) {
    this.result.noi = this.getNoiReportStatus(l);
    this.result.manufacturingReport = this.getManufacturingReportStatus(l);
    this.result.productReport = this.getProductsReportStatus(l);
    this.result.salesReport = this.getSalesReportStatus(l);
    return this.result;
  }

  /**
   * Gets the Reporting status of Noi for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  getNoiReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    // if (this.closedBeforeLastReportingYear(l)) {
    //   result = ReportStatus.NotRequired;
    // } else if (!l.noi || this.noiNotRenewed(l)) {
    //   result = ReportStatus.Missing;
    // }
    if (l.status === 'closed') { //this removes the NotRequired implementation
      result = ReportStatus.Reported
    } else if (this.isReportingPeriod() && l.noi && this.noiExpiringReportingEnd(l)) {
      result = ReportStatus.PendingReview;
    } else if (!l.noi || this.noiNotRenewed(l)) {
      result = ReportStatus.Missing;
    }

    return result;
  }

  /**
   * Gets the Reporting status of Manufacturing for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  getManufacturingReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if (this.closedBeforeLastReportingYear(l) || !l.manufacturing) {
      result = ReportStatus.NotRequired;
    } else if (l.manufacturing && !l.manufacturesCount) {
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * Gets the Reporting status of Products for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  getProductsReportStatus(l: LocationEntity): ReportStatus {
    let result = ReportStatus.Reported;
    if (this.closedBeforeLastReportingYear(l)) {
      result = ReportStatus.NotRequired;
    } else if (!l.productsCount) {
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * Gets the Reporting status of Sales for a location
   * @param l `LocationEntity`
   * @returns `ReportStatus` = 'reported' | 'notRequired' | 'missing'
   */
  getSalesReportStatus(l: LocationEntity): ReportStatus { 
    let result = ReportStatus.Reported;
    if (
      this.closedBeforeLastReportingYear(l) ||
      this.noiCreatedAfterThisReportingStart(l) ||
      !l.noi
    ) {
      result = ReportStatus.NotRequired;
    } else if (!l.salesCount) {
      result = ReportStatus.Missing;
    }
    return result;
  }

  /**
   * finds out if Noi was not renewed for an active location
   *
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected noiNotRenewed(l: LocationEntity): boolean {   
    return (
      l.noi 
      && moment().isAfter(l.noi.expiry_date)
      && l.status === LocationStatus.Active
    );
  }

  /**
   * finds out if the location was closed before last reporting year
   *
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected closedBeforeLastReportingYear(l: LocationEntity): boolean {    
    const currentReportingStart = ConfigDates.getCurrentReportingStartDate();
    return (
      l.status === LocationStatus.Closed &&
      moment(l.closedAt).isBefore(
        currentReportingStart.subtract(1, 'year'),
      )
    );
  }

  /**
   * Checks if noi was created after the start of this reporting year.
   * @param l `LocationEntity`
   * @returns `boolean`
   */
  protected noiCreatedAfterThisReportingStart(l: LocationEntity): boolean {
    const currentReportingStart = ConfigDates.getCurrentReportingStartDate();

    return (
      l.noi && moment(l.noi.created_at).isAfter(currentReportingStart)
    );
  }

  /**
   * finds out if Noi expiry is between Oct 1st and Jan 15th
   *
   * @param l `LocationEntity`
   * @returns `boolean`
  */
  protected noiExpiringReportingEnd(l: LocationEntity): boolean {   
    const { endReport } = getSalesReportingPeriod();

    const expiryDateYear = moment(l.noi.expiry_date).year();
    const reportEndYear = endReport.year();

    return (
      expiryDateYear === reportEndYear
      && l.status === LocationStatus.Active
    )
  }

  protected isReportingPeriod(): boolean {
    const { startReport, endReport } = getSalesReportingPeriod();
    return moment().isBetween(startReport, endReport);
  }
}
