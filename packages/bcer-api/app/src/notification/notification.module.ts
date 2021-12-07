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

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, SubscriptionEntity]),
    UserModule,
  ],
  controllers: [NotificationDataPortalController, SubscriptionController],
  providers: [NotificationService, TextService],
})
export class NotificationModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(UserMiddleware).forRoutes(SubscriptionController);
  }
}
