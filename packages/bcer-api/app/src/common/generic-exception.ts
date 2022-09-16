import { HttpStatus, HttpException } from '@nestjs/common';
import { CommonError } from './common.errors';

export class GenericError {
  /** Internal code */
  type: string;

  /** User friendly message */
  message: string;

  /** Default is Internal Server Error */
  status?: HttpStatus;
}

export class GenericException extends HttpException {
  public originalError: any;

  constructor(error: GenericError, originalError?: any) {
    if (originalError && originalError.code === 'ECONNABORTED') {
      throw new GenericException(CommonError.GATEWAY_TIMEOUT);
    }

    const errorCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('generic exception')
    console.error(error);
    console.error(originalError);
    super (
      {
        error: error.type,
        message: error.message,
      },
      errorCode,
    );

    this.originalError = originalError;
  }
}
