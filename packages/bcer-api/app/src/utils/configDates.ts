import moment, { Moment } from "moment";

export class ConfigDates {
  /**
   * Time when a sales year starts in MM-DD format. default 10-01 (Oct 1st)
   */
  static readonly salesReportStart = process.env.SALES_REPORT_START_DATE || '10-01';

  /**
   * Time when a sales year ends in MM-DD format. default 01-15 (Jan 15)
   */
  static readonly salesReportEnd = process.env.SALES_REPORT_END_DATE || '01-15';

  /**
   * Time when a reporting period starts in MM-DD format. default 10-01 (Oct 1st)
   */
  static readonly reportingYearStart = process.env.REPORTING_YEAR_START || '10-01';

  static getCurrentReportingStartDate(): Moment {
    let startDate = moment(`${moment().year()}-${this.reportingYearStart}`);
    if(moment().isBefore(startDate)){
      startDate = startDate.subtract(1, 'year');
    }
    return startDate;
  }
}