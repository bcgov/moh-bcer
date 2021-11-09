import moment, { Moment } from "moment";
import { CronName } from "../enum/cronName.enum";

export class CronConfig {
    private static closeLocationCronTime: string = process.env.CLOSE_LOCATION_CRON_TIME || '0 1 16 1 *';
    private static noiExpiryDate =  process.env.NOI_EXPIRY_DATE || '12-01'; // MM-DD
    private static runCronJobs: string = process.env.CRON_JOB_NAMES; //as csv eg. cronJob1,cronJob2 of type CronName.
    private static cronTimeZone: TimeZone = { timeZone: process.env.CRON_TIME_ZONE || 'America/Vancouver' };
  
    static getCloseLocationCronTime(): string {
      return this.closeLocationCronTime;
    }
  
    static getRunCronFlag(cronJob: CronName): boolean {
      const cronJobList: Array<string> = this.runCronJobs?.split(',');
      return cronJobList?.includes(cronJob);
    }

    static getCronTimeZone(): TimeZone {
      return this.cronTimeZone;
    }
    /*
     * Makes expiry date year agnostic.
     */
    static getNoiExpiryDate(): Moment {
      let expiryDate = moment(`${moment().year()}-${this.noiExpiryDate}`);
      if(moment().isBefore(expiryDate)){
        expiryDate = expiryDate.subtract(1, 'year');
      }
      return expiryDate;
    }

    /**
     * Finds out next expiry date for a NOI
     */
    static assignNextExpairyDate(renewedDate : Date): Date {
      const expiryDate = this.getNoiExpiryDate();
      if(moment(renewedDate).isAfter(expiryDate)){
        return expiryDate.add(1, 'year').toDate();
      }
      return expiryDate.toDate();
    }
  }

  export interface TimeZone {
    timeZone: string,
  }