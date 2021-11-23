import { NotAcceptableException } from '@nestjs/common';
import { NotifyClient } from 'notifications-node-client';
import { GeneralUtil } from 'src/utils/util';

export class TextService {
  private readonly apiEndpoint =
    process.env.TEXT_API_ENDPOINT || 'https://api.notification.canada.ca';
  private readonly apiKey = process.env.TEXT_API_KEY;
  private readonly templateId =
    process.env.TEXT_GENERIC_NOTIFICATION_TEMPLATE_ID;
  private readonly reference = process.env.TEXT_REFERENCE || 'abc123';

  private messageClient: any;

  constructor() {
    this.messageClient = new NotifyClient(this.apiEndpoint, this.apiKey);
  }

  private async send(message: string, phoneNumber: string) {
    const response = await this.messageClient.sendSms(
      this.templateId,
      `+1${phoneNumber}`,
      {
        personalisation: {
          message,
        },
        reference: this.reference,
      },
    );
  }

  async sendMessage(message: string, phoneNumbers: Array<string>) {
    if (message?.length > 612) throw NotAcceptableException;
    const result = await (Promise as any).allSettled(
      phoneNumbers.map(async (phoneNumber) => {
        const formattedPhoneNumber = GeneralUtil.getRawPhoneNumber(phoneNumber);
        await this.send(message, formattedPhoneNumber);
      }),
    );

    console.log(result[0].reason.response.data.errors);
  }
}
