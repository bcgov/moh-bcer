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
import * as faker from 'faker/locale/en_CA';
export class SaveSubmissionDTO {

  @ApiProperty({
    description: 'Id of the submission to save',
    example: faker.datatype.uuid(),
  })
  submissionId: string;

  @ApiProperty({
    description: 'Header mapping schema',
  })
  @IsNotEmpty()
  mapping: object;
}
