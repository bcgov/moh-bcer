import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserTypeEnum } from 'src/user/enums/user-type.enum'
import { faker } from '@faker-js/faker/locale/en_CA';

export class AuthRegisterDTO {
  @ApiProperty({
    description: 'BCeID for this user',
    example: faker.string.uuid(),
  })
  @IsNotEmpty()
  bceid: string;

  @ApiProperty({
    description: 'Email: must be unique',
    example: faker.internet.email(),
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: UserTypeEnum,
    description: 'bo for BusinessOwner is the default. may be phased out entirely',
    example: UserTypeEnum.BUSINESS_OWNER,
    default: 'bo'
  })
  type: UserTypeEnum;

  @ApiProperty({
    description: 'a word yielding a pass',
    example: faker.random.word(),
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'the name occuring primarily',
    example: faker.person.firstName(),
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'name, the latter',
    example: faker.person.lastName()
  })
  @IsNotEmpty()
  lastName: string;
}
