import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationService } from 'src/location/location.service';
import { UpdateResult } from 'typeorm';
import { CronConfig } from './config/cron.config';
import { CronName } from './enum/cronName.enum';

@Injectable()
export class CronService {
  constructor(
    private readonly locationService: LocationService,
  ) {}
  /*
   * This Cron job run once a year, to mark all the locations with expired NOI's as closed
   */
  @Cron(CronConfig.getCloseLocationCronTime(), CronConfig.getCronTimeZone())
  async CRON_closeLocationWithExpiredNOI(): Promise<void> {
    await this.runCron(CronName.CLOSE_LOCATION_WITH_EXPIRED_NOI);
  }

  async runCron(cronJob: CronName): Promise<void>{
    try{
      if (!CronConfig.getRunCronFlag(cronJob)) {
        throw new Error(`ENV CRON_JOB_NAMES does not include ${cronJob}`);
      }
      let result: UpdateResult;
      switch(cronJob){
        case CronName.CLOSE_LOCATION_WITH_EXPIRED_NOI:
          result = await this.locationService.cancelAllLocationWithExpiredNOI();
          break;
        default:
          break;
      }
      Logger.log(
        `Cron: ${cronJob} ran successfully. Updated ${result?.affected} entries`,
      );
      // TODO: Add notification/slack-integration
    }catch(e){
      // TODO: Send notification
      Logger.error(`Failed to run ${cronJob}: ${e?.message}`);
    }
  }
}
