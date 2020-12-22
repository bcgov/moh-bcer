import { HttpStatus } from '@nestjs/common';
import { GenericError } from './generic-exception';

export const CommonError = {
  INTERNAL_ERROR: {
    type: 'INTERNAL_ERROR',
    message: 'Internal Server Error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  } as GenericError,

  FAILED_FIELD_VALIDATION: {
    type: 'FAILED_FIELD_VALIDATION',
    message:
      'status fields were rejected. Please, check your information and try again.',
    httpStatus: HttpStatus.BAD_REQUEST,
  } as GenericError,

  UNSUPPORTED_MEDIA_TYPE: {
    type: 'UNSUPPORTED_MEDIA_TYPE',
    message: 'Unsupported file type.',
    status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  } as GenericError,

  GATEWAY_TIMEOUT: {
    type: 'GATEWAY_TIMEOUT',
    message: 'Gateway Timeout',
    status: HttpStatus.GATEWAY_TIMEOUT,
  } as GenericError,
};
