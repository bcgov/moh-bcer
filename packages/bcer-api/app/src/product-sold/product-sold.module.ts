import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoiController } from 'src/noi/noi.controller';
import { BusinessModule } from 'src/business/business.module';
import { LocationModule } from 'src/location/location.module';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { ProductSoldEntity } from './entities/product-sold.entity';
import { ProductSoldService } from './product-sold.service';
import { LocationEntity } from 'src/location/entities/location.entity';
import { BusinessEntity } from 'src/business/entities/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSoldEntity, LocationEntity, BusinessEntity]),
    forwardRef(() => BusinessModule),
    forwardRef(() => LocationModule),
    forwardRef(() => UserModule),
  ],
  providers: [ProductSoldService],
  exports: [ProductSoldService],
  controllers: [],
})
export class ProductSoldModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(UserMiddleware).forRoutes(NoiController);
  }
}
