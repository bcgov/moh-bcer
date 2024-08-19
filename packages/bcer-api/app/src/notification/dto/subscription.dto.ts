import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';


export class SubscriptionDTO {
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+12344567890',
  })
  @IsString()
  @IsOptional()
  @Matches(/^$|^\+\d{11}$/)
  phoneNumber1: string;

  @ApiProperty({
    description: 'Phone number with country code',
    example: '+12344567890',
  })
  @IsString()
  @IsOptional()
  @Matches(/^$|^\+\d{11}$/)
  phoneNumber2: string;

  @ApiProperty({
    description: 'is subscription confirmed',
    example: true,
  })
  @IsBoolean()
  confirmed: boolean;
}
