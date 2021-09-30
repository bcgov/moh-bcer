import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalesReportController } from 'src/sales/sales.controller';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { SalesReportService } from 'src/sales/sales.service';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { LocationModule } from 'src/location/location.module';
import { SubmissionModule } from 'src/submission/submission.module';
import { SubmissionService } from 'src/submission/submission.service';
import { ProductSoldModule } from 'src/product-sold/product-sold.module';
import { LocationEntity } from 'src/location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesReportEntity, LocationEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
    forwardRef(() => SubmissionModule),
    forwardRef(() =>ProductSoldModule),
  ],
  exports: [SalesReportService],
  providers: [SalesReportService],
  controllers: [SalesReportController]
})
export class SalesReportModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(SalesReportController);
  }
}
