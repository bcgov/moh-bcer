import { Injectable } from '@nestjs/common';
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

@Injectable()
export class NotificationService {
  constructor(
    private textService: TextService,
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
  ): Promise<SubscriptionEntity> {
    const existing = await this.findSubscription(payload.businessId);
    if (existing?.id) {
      return await this.updateSubscription(payload);
    }

    const subscription = this.subscriptionRepository.create({ ...payload });
    await this.subscriptionRepository.save(subscription);
    return this.findSubscription(payload.businessId);
  }

  async updateSubscription({
    id,
    businessId,
    ...rest
  }: SubscriptionDTO): Promise<SubscriptionEntity> {
    await this.subscriptionRepository.update({ businessId }, { ...rest });
    return await this.findSubscription(businessId);
  }

  async findSubscription(businessId: string): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.findOne({ businessId });
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
    const phoneNumbers: string[] = [];
    if (!errorData) return null;
    errorData.forEach(entry => {
      phoneNumbers.push(entry.recipient);
    });
    return phoneNumbers;
  }
}
