import { GenericError } from 'src/common/generic-exception';
import { HttpStatus } from '@nestjs/common';

export const AuthError = {
  NO_USER_FOUND: {
    type: 'LOGIN_FAILED',
    message: 'No user was found matching the provided ID',
    status: HttpStatus.NOT_FOUND,
  } as GenericError,
}
