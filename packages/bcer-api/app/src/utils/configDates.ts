export class ConfigDates {
  /**
   * Time when a sales year starts in MM-DD format. default 10-01 (Oct 1st)
   */
  static readonly salesReportStart = process.env.SALES_REPORT_START_DATE || '10-01';

  /**
   * Time when a sales year ends in MM-DD format. default 01-15 (Jan 15)
   */
  static readonly salesReportEnd = process.env.SALES_REPORT_END_DATE || '01-15';
}