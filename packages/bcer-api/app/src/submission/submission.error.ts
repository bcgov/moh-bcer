import { GenericError } from 'src/common/generic-exception';
import { HttpStatus } from '@nestjs/common';

export const SubmissionError = {
  FAILED_TO_GET_SUBMISSION: {
    type: 'FAILED_TO_GET_SUBMISSION',
    message: 'We were unable to retrieve the requested submission',
    status: HttpStatus.BAD_REQUEST,
  } as GenericError,
};
