import { ApiProperty } from '@nestjs/swagger';
import {
  IsPostalCode,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';

export class SetupBusinessDTO {
  @ApiProperty({
    description: 'Legal name of business',
    example: faker.company.name()
  })
  @IsNotEmpty()
  legalName: string;
}

export class BusinessDTO {

  @ApiProperty({
    description: 'Business owner email',
    example: faker.internet.email()
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Business web page (optional)',
    example: faker.internet.url(),
    required: false
  })
  @IsUrl()
  @ValidateIf(e => e.webpage !== '')
  @IsOptional()
  webpage: string;

  @ApiProperty({
    description: 'Legal name of business',
    example: faker.company.name()
  })
  @IsNotEmpty()
  legalName: string;

  @ApiProperty({
    description: 'Business name',
    example: faker.company.catchPhrase()
  })
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    description: 'Street Address of business',
    example: faker.location.streetAddress()
  })
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    description: 'Street Address, line 2',
    example: faker.location.streetAddress()
  })
  @IsOptional()
  addressLine2: string;

  @ApiProperty({
    description: 'City',
    example: faker.location.city()
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Postal Code',
    example: faker.location.zipCode()
  })
  @IsNotEmpty()
  @IsPostalCode('CA')
  postal: string;

  @ApiProperty({
    description: 'Business phone number',
    example: faker.phone.number()
  })
  @IsNotEmpty()
  @IsPhoneNumber('CA')
  phone: string;

  @ApiProperty({
    description: 'Province',
    example: "ON, AB"
  })
  @IsNotEmpty()
  @IsNotEmpty()
  province: string;
}
