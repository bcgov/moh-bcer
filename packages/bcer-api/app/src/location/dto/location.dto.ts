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
import { HealthAuthority } from 'src/business/enums/health-authority.enum'
import { faker } from '@faker-js/faker/locale/en_CA';

export class LocationDTO {

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
    description: 'Business name',
    example: faker.company.catchPhrase()
  })
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    description: 'Street Address of business',
    example: faker.location.streetAddress()
  })
  @IsOptional()
  addressLine1: string;

  @ApiProperty({
    description: 'Street Address, line 2',
    example: faker.location.streetAddress()
  })
  @IsNotEmpty()
  addressLine2: string;

  @ApiProperty({
    description: 'City',
    example: faker.location.city()
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    description: 'Postal Code',
    example: faker.location.zipCode()
  })
  @IsOptional()
  @IsPostalCode('CA')
  postal: string;

  @ApiProperty({
    description: 'Location phone number',
    example: faker.phone.number()
  })
  @IsNotEmpty()
  @IsPhoneNumber('CA')
  phone: string;

  @ApiProperty({
    description: 'Whether or not minors can enter',
    example: true
  })
  @IsOptional()
  underage: string;

  @ApiProperty({
    description: 'Unique circumstances around access detailed here',
    example: faker.lorem.words(),
  })
  @IsNotEmpty()
  underage_other: string;

  @ApiProperty({
    description: 'The Health Authority this business belongs to',
    example: 'island'
  })
  @IsOptional()
  health_authority: string;

  @ApiProperty()
  @IsOptional()
  health_authority_other: string;

  @ApiProperty({
    description: 'The name the store is doing business as',
    example: 'EZ Vape Oven'
  })
  @IsNotEmpty()
  doingBusinessAs: string;

  @ApiProperty({
    description: 'Does this location also manufacture e-substances',
    example: false,
    default: false
  })
  @IsOptional()
  manufacturing: string;

  @ApiProperty({
    description: 'Latitude of a location'
  })
  @IsOptional()
  latitude?: string;

  @ApiProperty({
    description: 'Longitude of a location'
  })
  @IsOptional()
  longitude?: string;

  @ApiProperty({
    description: 'Geo address confidence of a location'
  })
  @IsOptional()
  geoAddressConfidence?: string;

  @ApiProperty({
    description: 'Is this an online business or has physical address or both?',
    example: 'Online'
  })
  @IsNotEmpty()
  location_type: string;
}
