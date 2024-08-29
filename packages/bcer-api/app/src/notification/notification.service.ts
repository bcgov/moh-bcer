import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
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
    pending: string[],
    sender?: string,
  ): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create({
      ...data,
      completed: false,
      pending,
      sender,
    });
    await this.notificationRepository.save(notification);
    return await this.findOneNotification(notification.id);
  }

  async findOneNotification(id: string): Promise<NotificationEntity> {
    return await this.notificationRepository.findOne({ where: {id: id} });
  }

  async getNotifications(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({order: {createdAt: 'DESC'} });
  }

  async getSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({relations: ['business']});
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
    updateData: Partial<NotificationEntity> = {},
    completed: boolean,
  ): Promise<NotificationEntity> {
    await this.notificationRepository.update(
      { id },
      {
        ...updateData,
        completed,
      },
    );
    return await this.notificationRepository.findOne({ where: {id: id} });
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
    return await this.subscriptionRepository.findOne({ where: { business: Equal(businessId) } });
  }

  async findSubscriptionById(id: string): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.findOne({ where: { id: id }});
  }

  async findAllActiveSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({ where: {confirmed: true }});
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

  async resendText(notification: NotificationEntity, recipient: RecipientType, sender?: string): Promise<NotificationEntity> {
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

    if (recipient === RecipientType.All && !notification?.completed){
      throw new ForbiddenException('Can not resend to all recipients for a pending notification');
    }

    const data: NotificationDTO = {
      message: notification.message,
      title: notification.title,
    };

    return await this.createNotification(data, phoneNumbers, sender);
  }

  /**
   * Finds and returns all the Notification that are yet to be sent.
   * 
   * @returns {NotificationEntity[]} `NotificationEntity[]`
   */
  async findPendingNotifications(): Promise<NotificationEntity[]>{
    const qb = this.notificationRepository.createQueryBuilder('notification')
      .where('completed = :completed', { completed: false })
      .orderBy('created_at', 'ASC');
    
    return await qb.getMany();
  }

  /**
   * This method finds the earliest pending notification and sends text to 
   * pending phone numbers.
   * 
   * @param {number} batch number specifying the batch quantity.
   * @returns string
   */
  async sendNotificationBatch(batch = 50){
    const pendingNotifications = await this.findPendingNotifications();
    if (!pendingNotifications?.length){
      throw new Error('Nothing to send!');
    }
    const notification = pendingNotifications[0];

    if(!notification.pending?.length){
      await this.updateNotification(notification.id, {}, true);
      return;
    }

    const currentBatch = notification.pending.slice(0, batch);
    const pending = notification.pending.slice(batch);
    const completed = !pending.length;


    const content: NotificationDTO = {
      title: notification.title || '',
      message: notification.message,
    }
    const result = await this.sendText(content, currentBatch);

    const updateFields: Partial<NotificationEntity> = {
      pending,
      sent: notification.sent?.length ? [...notification.sent, ...currentBatch] : currentBatch,
      success: notification.success ? notification.success + result.success : result.success,
      fail: notification.fail ? notification.fail + result.fail : result.fail,
      errorData: notification.errorData?.length ? [...notification.errorData, ...result.errorData] : result.errorData,
    }

    return await this.updateNotification(notification.id, updateFields, completed);
  }
}
