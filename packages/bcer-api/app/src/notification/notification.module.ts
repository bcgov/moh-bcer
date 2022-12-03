import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationDataPortalController } from './notificationDataPortal.controller';
import { NotificationService } from './notification.service';
import { TextService } from './textService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { BusinessModule } from 'src/business/business.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, SubscriptionEntity]),
    UserModule,
    BusinessModule,
  ],
  controllers: [NotificationDataPortalController, SubscriptionController],
  providers: [NotificationService, TextService],
  exports: [NotificationService],
})
export class NotificationModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(UserMiddleware).forRoutes(SubscriptionController);
  }
}
