import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SalesReportController } from 'src/sales/sales.controller';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { SalesReportService } from 'src/sales/sales.service';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesReportEntity]),
    forwardRef(() => UserModule),
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
