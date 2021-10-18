export class CronConfig {
    private static closeLocationCronTime: string = process.env.CLOSE_LOCATION_CRON_TIME || '0 3 15 1 *';
    private static noiExpiryCronTime: string = process.env.NOI_EXPIRY_CRON_TIME || '0 3 1 12 *';
    private static runCronFlag: boolean = process.env.RUN_CRON === 'true';
    private static cronTimeZone: TimeZone = { timeZone: process.env.CRON_TIME_ZONE || 'America/Vancouver' };
  
    static getCloseLocationCronTime(): string {
      return this.closeLocationCronTime;
    }
  
    static getNoiExpairyCronTime(): string {
      return this.noiExpiryCronTime;
    }
  
    static getRunCronFlag(): boolean {
      return this.runCronFlag;
    }

    static getCronTimeZone(): TimeZone {
      return this.cronTimeZone;
    }
  }

  export interface TimeZone {
    timeZone: string,
  }