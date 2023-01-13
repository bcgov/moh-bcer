import { Logger } from '@nestjs/common';
import Axios from 'axios';
import { LocationEntity } from 'src/location/entities/location.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export class EmailService {

  
  private readonly apiEndpoint =
    process.env.EMAIL_API_ENDPOINT || 'https://api.notification.canada.ca/v2/notifications/email';
  private readonly apiKey = 
    process.env.TEXT_API_KEY;
  private readonly templateId =
    process.env.EMAIL_GENERIC_NOTIFICATION_TEMPLATE_ID;
  private readonly vapingEmail =
      process.env.VAPING_NOTIFICATION_EMAIL;

  async sendMail(message: string, user: UserEntity, location: LocationEntity) {
    return await Axios.post(this.apiEndpoint,  {
              email_address: this.vapingEmail,
              template_id: this.templateId,
              personalisation: {
                address: location.addressLine1,
                sendersName: `${user.firstName || ""} ${user.lastName || ""}`,
                sendersEmail: `${user.email || ""}`,
                message
              }
            },
            {
              headers: {
                Authorization: `ApiKey-v1 ${this.apiKey}`,
                'Content-Type': 'application/json',
              }
            })
            .then(function (response) {
              Logger.log(`Email successfully sent`);
              Logger.log(`Status: ${response.status} ${response.statusText}`)
              Logger.log(`ConfigData: ${response.config.data}`);

              return 'ok'
            })
            .catch(function (error) {
              Logger.log(`Status: ${error.response.status} ${error.response.statusText}`)
              Logger.log(`Error Sending Email: ${error.response.config.data}`)

              return `Error Sending Email: ${error.response.status} ${error.response.statusText}`;
            });
  }
}