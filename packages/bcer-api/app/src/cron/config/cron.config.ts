import moment, { Moment } from "moment";
import { CronName } from "../enum/cronName.enum";

export class CronConfig {
    private static closeLocationCronTime: string = process.env.CLOSE_LOCATION_CRON_TIME || '0 1 16 1 *';

    // Expiry date indicated when the businesses can start renewing the NOI 
    private static noiExpiryDate =  process.env.NOI_EXPIRY_DATE || '10-01'; // MM-DD

    // Valid Till indicated till the actual date until which the NOI is valid for legal purposes.
    private static noiValidTill = process.env.NOI_VALID_TILL || '01-15'; // MM-DD
    private static runCronJobs: string = process.env.CRON_JOB_NAMES; //as csv eg. cronJob1,cronJob2 of type CronName.
    private static cronTimeZone: TimeZone = { timeZone: process.env.CRON_TIME_ZONE || 'America/Vancouver' };
    
    // Notification Cron time
    private static sendNotificationCronTime = process.env.SEND_NOTIFICATION_CRON_TIME || '*/3 * * * *';
    private static notificationBatchSize = +(process.env.NOTIFICATION_BATCH_SIZE || 50);
  
    static getCloseLocationCronTime(): string {
      return this.closeLocationCronTime;
    }

    static getSendNotificationCronTime(): string {
      return this.sendNotificationCronTime;
    }

    static getNotificationBatchSize(): number {
      return this.notificationBatchSize;
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
     * 
     * Function should be updated further to account for expired NOIs.
     */
    static getNoiValidTill(): Moment {
      let validTill = moment(`${moment().year()}-${this.noiValidTill}`).add(1, 'year');
      return validTill;
    }

    /**
     * Finds out next expiry date for a NOI. Need some update to properly account for already closed locations
     * 
     */
    static assignNextExpiryDate(renewedDate : Date): Date {
      let validTill = this.getNoiValidTill();
      const expiryDate = this.getNoiExpiryDate();
      const thisYearExpiryDate = moment(`${moment().year()}-${this.noiExpiryDate}`);
      if(moment().isSameOrAfter(thisYearExpiryDate) && moment(renewedDate).isSameOrAfter(expiryDate)){
        validTill = validTill.add(1, 'year');
      }
      return validTill.toDate();
    }
  }

  export interface TimeZone {
    timeZone: string,
  }