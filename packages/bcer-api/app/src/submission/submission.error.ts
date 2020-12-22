import { GenericError } from 'src/common/generic-exception';
import { HttpStatus } from '@nestjs/common';

export const SubmissionError = {
  FAILED_TO_GET_SUBMSISSION: {
    type: 'FAILED_TO_GET_SUBMSISSION',
    message: 'We were unable to retrieve the requested submission',
    status: HttpStatus.BAD_REQUEST,
  } as GenericError,
};
