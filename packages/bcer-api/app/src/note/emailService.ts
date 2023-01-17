import { Logger } from '@nestjs/common';
import Axios from 'axios';
import { LocationEntity } from 'src/location/entities/location.entity';
import { BCERNotifyClient } from 'src/notification/notification.client';
import { UserEntity } from 'src/user/entities/user.entity';

export class EmailService {
  private readonly apiEndpoint =
    process.env.EMAIL_API_ENDPOINT || 'https://api.notification.canada.ca';
  private readonly apiKey = 
    process.env.TEXT_API_KEY;
  private readonly templateId =
    process.env.EMAIL_GENERIC_NOTIFICATION_TEMPLATE_ID;
  private readonly vapingEmail =
      process.env.VAPING_NOTIFICATION_EMAIL;
  private readonly reference = process.env.EMAIL_REFERENCE || 'emailRef123';

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

  async sendMail(message: string, user: UserEntity, location: LocationEntity) {
    return await this.messageClient.sendEmail(
              this.templateId, 
              this.vapingEmail,
              {
                personalisation: {
                  address: location.addressLine1,
                  sendersName: `${user.firstName || ""} ${user.lastName || ""}`,
                  sendersEmail: `${user.email || ""}`,
                  message
                },
                reference: this.reference,
              },
            )
            .then(function (response) {
              Logger.log(`Email successfully sent`);
              Logger.log(`Status: ${response.status} ${response.statusText}`)
              Logger.log(`ConfigData: ${response.config.data}`);

              return 'ok'
            })
            .catch(function (error) {
              Logger.error(`Code: ${error.code}`)
              Logger.error(`Message: ${error.message}`)
              Logger.error(`Status: ${error.response.status} ${error.response.statusText}`)
              Logger.error(`Error Sending Email: ${error.response.config.data}`)

              return `Error Sending Email: ${error.response.status} ${error.response.statusText}`;
            });
  }
}