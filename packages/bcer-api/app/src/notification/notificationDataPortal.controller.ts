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
import { AuthGuard, RoleGuard } from 'src/auth/auth.module';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { NotificationDTO } from './dto/notification.dto';
import { ResendNotificationDTO } from './dto/resend-notification.dto';
import { RecipientType } from './enum/recipient.enum';
import { NotificationService } from './notification.service';
import { NotificationRO } from './ro/notification.ro';

@ApiBearerAuth()
@UseGuards(AuthDataGuard)
@ApiTags('Notifications')
@Controller('data/notification')
export class NotificationDataPortalController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Sends a text notification to all the subscribed members',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @UseGuards(AuthDataGuard)
  @Post()
  async sendMessage(
    @Req() req: any,
    @Body() payload: NotificationDTO,
  ): Promise<NotificationRO> {
    const sender = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`;
    let notification = await this.notificationService.createNotification(
      payload,
      sender,
    );
    const phoneNumbers = await this.notificationService.getSubscribedPhoneNumbers();
    if (phoneNumbers.length === 0) {
      throw new HttpException(
        'No Subscribed Phone Number found!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const result = await this.notificationService.sendText(
      payload,
      phoneNumbers,
    );
    notification = await this.notificationService.updateNotification(
      notification.id,
      result,
    );
    return notification.toResponseObject();
  }

  @ApiOperation({ summary: 'Get all the Notifications from database' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Get()
  async getNotifications() {
    const notifications = await this.notificationService.getNotifications();
    return notifications.map(n => n.toResponseObject());
  }

  @ApiOperation({ summary: 'Resend an existing message' })
  @ApiResponse({ status: HttpStatus.OK, type: NotificationRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Patch()
  async resendText(@Body() payload: ResendNotificationDTO) {
    const { id, recipient = RecipientType.ErrorOnly } = payload;
    let notification = await this.notificationService.findOneNotification(id);
    if (!notification) {
      throw new HttpException(
        'Notification with given id not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let phoneNumbers: string[] = [];
    if (recipient === RecipientType.ErrorOnly) {
      phoneNumbers = this.notificationService.getErroredPhoneNumber(
        notification,
      );
    } else if (recipient === RecipientType.All) {
      phoneNumbers = await this.notificationService.getSubscribedPhoneNumbers();
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

    const result = await this.notificationService.sendText(data, phoneNumbers);
    result.success += notification.success;

    notification = await this.notificationService.updateNotification(
      id,
      result,
      true,
    );
    return notification.toResponseObject();
  }
}
