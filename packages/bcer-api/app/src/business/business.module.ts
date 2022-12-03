import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { BusinessController } from 'src/business/business.controller';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { BusinessDataPortalController } from './businessDataPortal.controller';
import { LocationModule } from 'src/location/location.module';
import { NoiModule } from 'src/noi/noi.module';
import { ProductsModule } from 'src/products/products.module';
import { ManufacturingModule } from 'src/manufacturing/manufacturing.module';
import { ProductSoldModule } from 'src/product-sold/product-sold.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
    forwardRef(() => NoiModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => ManufacturingModule),
    forwardRef(() => ProductSoldModule),
  ],
  providers: [BusinessService],
  exports: [BusinessService],
  controllers: [BusinessController, BusinessDataPortalController]
})
export class BusinessModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(BusinessController);
  }
}
