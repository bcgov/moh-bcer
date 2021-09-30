import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from 'src/business/entities/business.entity'
import { BusinessModule } from 'src/business/business.module';
import { LocationModule } from 'src/location/location.module';
import { ProductsModule } from 'src/products/products.module';
import { SubmissionService } from 'src/submission/submission.service';
import { SubmissionController } from 'src/submission/submission.controller';
import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionEntity, BusinessEntity]),
    forwardRef(() => BusinessModule),
    forwardRef(() => LocationModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => UserModule),
  ],
  providers: [SubmissionService],
  exports: [SubmissionService],
  controllers: [SubmissionController]
})
export class SubmissionModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(SubmissionController);
  }
}
