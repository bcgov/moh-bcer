import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { BusinessModule } from 'src/business/business.module';
import { UserModule } from 'src/user/user.module';
import { LocationModule } from 'src/location/location.module';
import { NoiModule } from 'src/noi/noi.module';
import { SubmissionModule } from 'src/submission/submission.module';
import { ProductsModule } from 'src/products/products.module';
import { ManufacturingModule } from 'src/manufacturing/manufacturing.module';
import { SalesReportModule } from 'src/sales/sales.module';
import { UploadModule } from 'src/upload/upload.module';

import { CONFIG } from './common.config';

export const documentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(CONFIG.general.title)
    .setDescription(CONFIG.general.description)
    .setVersion(`${CONFIG.version.major}.${CONFIG.version.minor}.${CONFIG.version.patch}`)
    .addBearerAuth()
    .build();

  const baseDocument = SwaggerModule.createDocument(
    app,
    options,
    {
      include: [
        AppModule,
        BusinessModule,
        UserModule,
        LocationModule,
        ProductsModule,
        ManufacturingModule,
        NoiModule,
        SubmissionModule,
        SalesReportModule,
        UploadModule,
      ],
    },
  );

  SwaggerModule.setup(
    'api',
    app,
    baseDocument,
    {
      swaggerOptions: {
        docExpansion: 'none',
        displayRequestDuration: true,
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
      },
    },
  );
};
