import { Injectable } from '@nestjs/common';
import { createGzip } from 'zlib';
import { createWriteStream } from 'fs';
import v8 from 'v8';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'America/Vancouver' })
  generateHeapSnapShot(): void {
    if(process.env.HEAPSNAPSHOT_ENABLED === 'true'){
      Logger.log('Heap snapshot process started');
      const zip = createGzip();
      const destination = createWriteStream(
        `${new Date().getTime()}.heapsnapshot.gz`,
      );
      const heapStream = v8.getHeapSnapshot();
      heapStream.pipe(zip).pipe(destination);
      heapStream.on('end', () => {
        Logger.log('heap snapshot written.');
      });
    }
  }
}
