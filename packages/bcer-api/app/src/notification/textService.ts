import { Logger, NotAcceptableException } from '@nestjs/common';
import { sleep } from 'src/utils/util';
import { NotificationReportDTO } from './dto/notification-report.dto';
import { NotificationDTO } from './dto/notification.dto';
import { BCERNotifyClient } from './notification.client';

export class TextService {
  private readonly apiEndpoint =
    process.env.TEXT_API_ENDPOINT || 'https://api.notification.canada.ca';
  private readonly apiKey = process.env.TEXT_API_KEY;
  private readonly templateId =
    process.env.TEXT_GENERIC_NOTIFICATION_TEMPLATE_ID;
  private readonly reference = process.env.TEXT_REFERENCE || 'abc123';

  private messageClient: any;

  constructor() {
    this.messageClient = new BCERNotifyClient(this.apiEndpoint, this.apiKey);
    
    if(process.env.TEXT_API_PROXY) {
      this.messageClient.setProxy({
        host: process.env.TEXT_API_PROXY,
        port: parseInt(process.env.TEXT_API_PROXY_PORT || '80', 10),
      })
    }
  }

  private async send(message: string, phoneNumber: string) {
    const response = await this.messageClient.sendSms(
      this.templateId,
      `${phoneNumber}`,
      {
        personalisation: {
          message,
        },
        reference: this.reference,
      },
    );
  }

  async sendMessage(
    data: NotificationDTO,
    phoneNumbers: Array<string>,
  ): Promise<NotificationReportDTO> {
    const { message, title } = data;
    if (message?.length > 612) throw NotAcceptableException;
    const result = await (Promise as any).allSettled(
      phoneNumbers.map(async (phoneNumber, i) => {
        /**
         * Limiting the api request to a maximum of 1000 per second.
         */
        await sleep(Math.floor(i + 1) / 1000);

        return this.send(message, phoneNumber);
      }),
    );

    return this.formatResult(result);
  }

  private formatResult(result: any[]): NotificationReportDTO {
    const formattedResult: NotificationReportDTO = {
      success: 0,
      fail: 0,
      errorData: [],
    };
    result.forEach(r => {
      if (r.status === 'fulfilled') {
        formattedResult.success++;
      } else {
        formattedResult.fail++;
        const reason = (r.reason?.response?.data?.errors || [])[0]?.message || `${r.reason}`;
        Logger.error(`Failed to send notification: ${reason}`)

        if (r.reason?.config?.data) {
          let config = JSON.parse(r.reason.config.data);
          formattedResult.errorData.push({
            recipient: config.phone_number,
            message: reason,
          });
        }
      }
    });

    return formattedResult;
  }
}
