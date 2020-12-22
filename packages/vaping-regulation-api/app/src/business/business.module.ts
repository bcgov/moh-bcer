import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from 'src/business/business.service';
import { BusinessController } from 'src/business/business.controller';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { UserMiddleware } from 'src/user/middleware/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessEntity]),
    UserModule,
  ],
  providers: [BusinessService],
  exports: [BusinessService],
  controllers: [BusinessController]
})
export class BusinessModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(UserMiddleware)
      .forRoutes(BusinessController);
  }
}
