const env = process.env.NODE_ENV;
let envPath;
if (['development', 'test', 'production'].includes(env)) { envPath = { path: '.env' } };
if (env === 'local') { envPath = { path: './../.env' } };
require('dotenv').config(envPath);

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as bodyParser from 'body-parser';
import { ClassValidationParser } from 'src/common/parsers/class-validation.parser';
import { CONFIG } from './common/common.config';
import { documentation } from './common/common.documentation';
import { GenericError, GenericException } from 'src/common/generic-exception';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';

import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

(async function () {
  const httpsOptions = process.env.LOAD_CERTS === 'true' ? {
    key: process.env.PEM_KEY_PATH ? fs.readFileSync(process.env.PEM_KEY_PATH) : null,
    cert: process.env.PEM_CERT_PATH ? fs.readFileSync(process.env.PEM_CERT_PATH) : null,
  } : null;
  const transports: winston.transport[] = [new winston.transports.Console({ level: 'debug' })];
  if (['development', 'test', 'production'].includes(process.env.NODE_ENV)) {
    const rotateFile = new winston.transports.DailyRotateFile({
      datePattern: 'yyyy-MM-DD',
      filename: path.join(process.env.LOGS_PATH || './', 'logs.log'),
    });
    transports.push(rotateFile);
  }
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: WinstonModule.createLogger({
      transports,
      exitOnError: false,
    })
  });
  app.enableCors();
  documentation(app);
  if (process.env.NODE_ENV !== 'production') {
    global['nestAppServer'] = app.getHttpServer();
  }
  Logger.log(`Running Vape API in ${process.env.NODE_ENV} mode`)
  Logger.log(`attempting connection to db host: ${process.env.DB_HOST}`)
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    disableErrorMessages: false,
    exceptionFactory: (errors: ValidationError[]) => {
      throw new GenericException({
        type: 'VALIDATION_FAILED',
        message: 'Field validation failed',
        status: 400,
      } as GenericError,
        ClassValidationParser.transformClassValidationErrors(errors)
      )
    },
  }));
  await app.listen(CONFIG.applicationPort);
  Logger.log(`Server running on http://localhost:${CONFIG.applicationPort}`, 'Bootstrap')
})();
