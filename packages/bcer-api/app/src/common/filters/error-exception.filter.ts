import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { ClassValidationParser } from 'src/common/parsers/class-validation.parser';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(Logger) private logger: LoggerService
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();
    const message = exception.message;
    const errorId = uuid();

    let logBody = request.body;
    if (logBody && JSON.stringify(logBody).length > 4000) {
      logBody = { 'message': 'Body is too large to log.' };
    }

    this.logger.error(`${moment().format('LLL')} - ${errorId}: error thrown with message ${message}, ${request.ctx?.bceidUser || 'unknown user'}`, request.path, logBody);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      response
        .status(status)
        .json({
          id: errorId,
          message: ClassValidationParser.transformClassValidatorException(message),
        });
    } else if (exception instanceof UnauthorizedException) {
      response
        .status(status)
        .json({
          id: errorId,
          type: 'UNAUTHORIZED',
          message: 'Authentication failed.',
          details: message,
          status: HttpStatus.UNAUTHORIZED
        });
    } else {
      const flattenedException =
        typeof exception.message === 'object' &&
        typeof (exception.message as any).message === 'object'
          ? exception.message
          : exception;

      const { originalError, message } = flattenedException;
      response
        .status(status)
        .json({
          id: errorId,
          type: flattenedException.type || 'UNKNOWN',
          message,
          details: originalError?.message || originalError,
          status,
        });
    }
  }
}
