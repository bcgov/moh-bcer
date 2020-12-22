import { ApiProperty } from '@nestjs/swagger';
import { UserRO } from './user.ro'

export class AuthLoginRO {
  @ApiProperty({
    description: 'User Profile',
    example: {
      id: 'someId',
    }
  })
  profile: UserRO;
}
