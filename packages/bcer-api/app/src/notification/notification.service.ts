import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ErrorDataType,
  NotificationReportDTO,
} from './dto/notification-report.dto';
import { NotificationDTO } from './dto/notification.dto';
import { SubscriptionDTO } from './dto/subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { NotificationEntity } from './entities/notification.entity';
import { TextService } from './textService';
import { BusinessService } from 'src/business/business.service';
import { RecipientType } from './enum/recipient.enum';
import { SubscriptionRO } from './ro/subscription.ro';

@Injectable()
export class NotificationService {
  constructor(
    private textService: TextService,
    private businessService: BusinessService,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async createNotification(
    data: Partial<NotificationEntity>,
    sender?: string,
  ): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create({
      ...data,
      completed: false,
      sender,
    });
    await this.notificationRepository.save(notification);
    return await this.findOneNotification(notification.id);
  }

  async findOneNotification(id: string): Promise<NotificationEntity> {
    return await this.notificationRepository.findOne({ id });
  }

  async getNotifications(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find();
  }

  async getSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find();
  }

  async sendText(
    data: NotificationDTO,
    phoneNumbers: string[],
  ): Promise<NotificationReportDTO> {
    const result = await this.textService.sendMessage(data, phoneNumbers);
    return result;
  }

  async updateNotification(
    id: string,
    updateData: NotificationReportDTO,
    completed = true,
  ): Promise<NotificationEntity> {
    await this.notificationRepository.update(
      { id },
      {
        ...updateData,
        completed,
      },
    );
    return await this.notificationRepository.findOne({ id });
  }

  async createOrUpdateSubscription(
    payload: SubscriptionDTO,
    businessId: string,
  ): Promise<SubscriptionEntity> {
    const existing = await this.findSubscriptionByBusinessId(businessId);
    if (existing?.id) {
      return await this.updateSubscription(existing.id, payload);
    }
    const business = await this.businessService.getBusinessById(businessId);

    const subscription = this.subscriptionRepository.create({
      ...payload,
      business,
    });
    await this.subscriptionRepository.save(subscription);
    return this.findSubscriptionById(subscription.id);
  }

  async updateSubscription(
    id: string,
    payload: SubscriptionDTO,
  ): Promise<SubscriptionEntity> {
    await this.subscriptionRepository.update({ id }, payload);
    return await this.findSubscriptionById(id);
  }

  async findSubscriptionByBusinessId(
    businessId: string,
  ): Promise<SubscriptionEntity> {
    const business = await this.businessService.getBusinessById(businessId);
    return await this.subscriptionRepository.findOne({ business });
  }

  async findSubscriptionById(id: string): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.findOne({ id });
  }

  async findAllActiveSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({ confirmed: true });
  }

  async getSubscribedPhoneNumbers(): Promise<string[]> {
    const subscriptions = await this.findAllActiveSubscription();
    const phoneNumbers: string[] = [];
    if (subscriptions) {
      subscriptions.forEach(sub => {
        if (sub.phoneNumber1) phoneNumbers.push(sub.phoneNumber1);
        if (sub.phoneNumber2) phoneNumbers.push(sub.phoneNumber2);
      });
    }
    return phoneNumbers;
  }

  getErroredPhoneNumber(notification: NotificationEntity): string[] {
    const errorData: ErrorDataType[] = notification.errorData;
    if (!errorData) return [];
    return errorData.map(e => e.recipient);
  }

  async resendText(notification: NotificationEntity, recipient: RecipientType) {
    let phoneNumbers: string[] = [];
    if (recipient === RecipientType.ErrorOnly) {
      phoneNumbers = this.getErroredPhoneNumber(notification);
    } else if (recipient === RecipientType.All) {
      phoneNumbers = await this.getSubscribedPhoneNumbers();
    }

    if (phoneNumbers.length === 0) {
      throw new HttpException(
        'No Phone Numbers Found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const data: NotificationDTO = {
      message: notification.message,
      title: notification.title,
    };

    const result = await this.sendText(data, phoneNumbers);
    result.success += notification.success;

    return await this.updateNotification(notification.id, result, true);
  }
}
