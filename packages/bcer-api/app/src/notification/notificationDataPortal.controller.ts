import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, RoleGuard, Roles } from 'src/auth/auth.module';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { NotificationDTO } from './dto/notification.dto';
import { ResendNotificationDTO } from './dto/resend-notification.dto';
import { RecipientType } from './enum/recipient.enum';
import { NotificationService } from './notification.service';
import { NotificationRO } from './ro/notification.ro';
import { SubscriptionRO } from './ro/subscription.ro';

@ApiBearerAuth()
@UseGuards(AuthDataGuard, RoleGuard)
@ApiTags('Notifications')
@Controller('data/notification')
export class NotificationDataPortalController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Sends a text notification to all the subscribed members',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @Roles(ROLES.MOH_ADMIN)
  @Post()
  async sendMessage(
    @Req() req: any,
    @Body() payload: NotificationDTO,
  ): Promise<NotificationRO> {
    const sender = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`;
    const phoneNumbers = await this.notificationService.getSubscribedPhoneNumbers();
    if (phoneNumbers.length === 0) {
      throw new HttpException(
        'No Subscribed Phone Number found!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let notification = await this.notificationService.createNotification(
      payload,
      phoneNumbers,
      sender,
    );
    return notification.toResponseObject();
  }

  @ApiOperation({ summary: 'Get all the Notifications from database' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.MOH_ADMIN)
  @Get()
  async getNotifications(): Promise<NotificationRO[]> {
    const notifications = await this.notificationService.getNotifications();
    return notifications.map(n => n.toResponseObject());
  }

  @ApiOperation({ summary: 'Get all the Subscribers from database' })
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionRO })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.MOH_ADMIN)
  @Get('subscribers')
  async getSubscribers(): Promise<SubscriptionRO[]> {
    const subscribers = await this.notificationService.getSubscriptions();
    return subscribers.map(s => s.toResponseObject());
  }

  @ApiOperation({ summary: 'Resend an existing message' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.MOH_ADMIN)
  @Patch('resend')
  async resendText(
    @Req() req: RequestWithUser,
    @Body() payload: ResendNotificationDTO,
  ): Promise<NotificationRO> {
    const sender = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`;

    const { id, recipient = RecipientType.ErrorOnly } = payload;
    const notification = await this.notificationService.findOneNotification(id);
    if (!notification) {
      throw new HttpException(
        'Notification with given id not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const result = await this.notificationService.resendText(
      notification,
      recipient,
      sender,
    );
    return result.toResponseObject();
  }
}
