import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoiEntity } from 'src/noi/entities/noi.entity'
import { NoiService } from 'src/noi/noi.service';
import { NoiController } from 'src/noi/noi.controller';
import { BusinessModule } from 'src/business/business.module';
import { LocationModule } from 'src/location/location.module';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoiEntity]),
    BusinessModule,
    LocationModule,
    UserModule,
  ],
  providers: [NoiService],
  exports: [NoiService],
  controllers: [NoiController]
})
export class NoiModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(NoiController);
  }
}
