import { ApiProperty } from '@nestjs/swagger';
import {
  IsPostalCode,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';
export class SaveSubmissionDTO {

  @ApiProperty({
    description: 'Id of the submission to save',
    example: faker.string.uuid(),
  })
  submissionId: string;

  @ApiProperty({
    description: 'Header mapping schema',
  })
  @IsNotEmpty()
  mapping: object;
}
