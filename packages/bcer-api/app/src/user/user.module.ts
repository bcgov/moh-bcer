import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './../auth/auth.service';
import { BusinessModule } from 'src/business/business.module';
import { LocationModule } from 'src/location/location.module';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserService } from './user.service';
import { UserDataPortalController } from './userDataPortal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => BusinessModule),
    forwardRef(() => LocationModule),
  ],
  controllers: [UserController, UserDataPortalController],
  providers: [AuthService, UserService],
  exports: [UserService]
})
export class UserModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(UserController);
  }
}
