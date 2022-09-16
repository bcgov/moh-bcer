import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, RoleGuard, Roles } from 'src/auth/auth.module';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { SubscriptionDTO } from './dto/subscription.dto';
import { NotificationService } from './notification.service';
import { SubscriptionRO } from './ro/subscription.ro';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Creates or updates a subscription to receive notification',
  })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Patch()
  async subscribeToTextNotification(
    @Request() req: RequestWithUser,
    @Body() payload: SubscriptionDTO,
  ): Promise<SubscriptionRO> {
    const subscription = await this.notificationService.createOrUpdateSubscription(
      payload, req.ctx.businessId
    );
    return subscription.toResponseObject();
  }

  @ApiOperation({
    summary: 'gets the subscription for a business if any',
  })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Get()
  async getSubscription(
    @Request() req: RequestWithUser,
  ): Promise<SubscriptionRO> {
    const subscription = await this.notificationService.findSubscriptionByBusinessId(
      req.ctx.businessId,
    );
    return subscription?.toResponseObject();
  }
}
