import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessEntity } from 'src/business/entities/business.entity';
import { BusinessModule } from 'src/business/business.module';
import { LocationEntity } from 'src/location/entities/location.entity'
import { LocationService } from 'src/location/location.service';
import { LocationController } from 'src/location/location.controller';
import { LocationDataPortalController } from 'src/location/locationDataPortal.controller';
import { ManufacturingModule } from 'src/manufacturing/manufacturing.module';
import { ProductsModule } from 'src/products/products.module';
import { SalesReportModule } from 'src/sales/sales.module';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { GeoCodeService } from './geoCode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity, BusinessEntity, SalesReportEntity]),
    forwardRef(() => BusinessModule),
    forwardRef(() => ManufacturingModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => SalesReportModule),
    forwardRef(() => UserModule),
  ],
  providers: [LocationService, GeoCodeService],
  exports: [LocationService],
  controllers: [LocationController, LocationDataPortalController]
})
export class LocationModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(LocationController);
  }
}
