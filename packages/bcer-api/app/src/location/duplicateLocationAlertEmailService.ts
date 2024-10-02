import { Logger } from '@nestjs/common';
import { BCERNotifyClient } from 'src/notification/notification.client';

export class duplicateLocationAlertEmailService { //sending email to the retailer and the VapingInfo mail box when duplicate locations being created 
  private readonly apiEndpoint = process.env.EMAIL_API_ENDPOINT || 'https://api.notification.canada.ca';
  private readonly apiKey = process.env.TEXT_API_KEY;
  private readonly templateIdRetailer = process.env.EMAIL_NOTIFICATION_TEMPLATE_ID_FOR_DUPLICATE_LOCATION_WARNING_TO_RETAILER;
  private readonly templateIdVapingInfo = process.env.EMAIL_NOTIFICATION_TEMPLATE_ID_FOR_DUPLICATE_LOCATION_WARNING_TO_VAPINGINFO;
  private readonly vapingEmail = process.env.VAPING_NOTIFICATION_EMAIL;
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

  async sendEmailNotification(dataForContext: any) {
    if(!dataForContext) return false;

    //get the list of new duplicate locations
    const duplicateLocations = dataForContext.dataForContext.locations.filter(location => !location.id && location.addressExists);
    console.log("duplicate locations: ", duplicateLocations)
    if(!duplicateLocations.length) return false;

    //send email to retailer
    const uniqueEmails = [...new Set(duplicateLocations.map(location => location.email))];
    console.log("sending to retailer: ", uniqueEmails)
    for (const email of uniqueEmails) {
      const emailPayloadRetailer = {
        template_id: this.templateIdRetailer,
        email_address: email, //receiptent's email
        personalisation: { //dynamic content for the email template.
          email_address: email
        },
        reference: this.reference
      };
  
      try {
        const response = await this.messageClient.apiClient.post('/v2/notifications/email', emailPayloadRetailer);
        Logger.log('Email to retailer ', emailPayloadRetailer.email_address,' sent successfully:', response.data);
      } catch (error) {
        Logger.error('Error occurred while sending email to retailer:', error.response ? error.response.data : error.message);
        return false;
      }
    }

    //send email to vapinginfo
    for (const location of duplicateLocations) {
      const emailPayload = {
        template_id: this.templateIdVapingInfo,
        email_address: this.vapingEmail,
        personalisation: {
          newAddress: location.addressLine1,
          location_type: location.location_type,
          addressLine1: location.addressLine1,
          city: location.city,
          postal: location.postal,
          phone: location.phone,
          email: location.email,
          underage: location.underage,
          health_authority: location.health_authority,
          manufacturing: location.manufacturing,
          latitude: location.latitude,
          longitude: location.longitude,
          health_authority_display: location.health_authority_display,
        },
        reference: this.reference
      };

      try {
        const response = await this.messageClient.apiClient.post('/v2/notifications/email', emailPayload);
        Logger.log('Email to VapingInfo sent successfully:', response.data);
      } catch (error) {
        Logger.error('Error occurred while sending email to Vaping Info:', error.response ? error.response.data : error.message);
        return false;
      }
    }
    return true;
  }
}