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
import { SubmissionTypeEnum } from 'src/submission/enums/submission.enum';

export class SubmissionDTO {

  @ApiProperty({
    description: 'Business id, the primary key for a business entity',
    example: faker.string.uuid(),
    default: 'Happy Puff'
  })
  @IsOptional()
  businessId?: string;

  @ApiProperty({
    description: 'Submission Type',
    example: SubmissionTypeEnum.location,
    default: SubmissionTypeEnum.location,
  })
  @IsOptional()
  type?: SubmissionTypeEnum;

  @ApiProperty({
    description: 'Submitted data as JSON',
    example: [{
      city: 'Victoria',
      businessName: 'Happy Vape'
    }]
  })
  @IsOptional()
  data?: any;
}

export class UpdateSubmissionDTO {

  @ApiProperty({
    description: 'Submission ID, if this is an update',
    example: faker.string.uuid(),
  })
  @IsOptional()
  submissionId?: string;

  @ApiProperty({
    description: 'Submitted data as JSON',
    example: [{
      city: 'Victoria',
      businessName: 'Happy Vape'
    }]
  })
  @IsOptional()
  data?: any;
}
