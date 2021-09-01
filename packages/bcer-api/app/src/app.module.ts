import {
  Logger,
  Module,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CsvModule } from 'nest-csv-parser';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from 'src/auth/middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { BusinessModule } from './business/business.module';
import { DatabaseModule } from './database/database.module';
import { ErrorExceptionFilter } from 'src/common/filters/error-exception.filter';
import { LocationModule } from './location/location.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { ManufacturingModule } from './manufacturing/manufacturing.module';
import { NoiModule } from './noi/noi.module';
import { ProductsModule } from './products/products.module';
import { SalesReportModule } from './sales/sales.module';
import { SubmissionModule } from './submission/submission.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

const moduleImports = [
  AuthModule,
  CsvModule,
  BusinessModule,
  DatabaseModule,
  UserModule,
  SubmissionModule,
  NoiModule,
  ManufacturingModule,
  LocationModule,
  UploadModule,
  ProductsModule,
  SalesReportModule,
];

if (process.env.HEAPSNAPSHOT_ENABLED === 'true') {
  moduleImports.push(ScheduleModule.forRoot());
}

@Module({
  imports: moduleImports,
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
  ],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(AuthMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
