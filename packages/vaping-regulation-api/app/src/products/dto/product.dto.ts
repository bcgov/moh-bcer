import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import * as faker from 'faker/locale/en_CA';

export class ProductDTO {

  @ApiProperty({
    description: 'Product type',
    example: 'e-substance cartridge'
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'VapeThings'
  })
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({
    description: 'Name of this product',
    example: 'Jewl Juice'
  })
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: 'Manufacturer name',
    example: 'Gringots'
  })
  @IsNotEmpty()
  manufacturerName: string;

  @ApiProperty({
    description: 'Manufacturer street address',
    example: faker.address.streetAddress()
  })
  @IsNotEmpty()
  manufacturerAddress: string;

  @ApiProperty({
    description: '',
    example: faker.phone.phoneNumber('CA')
  })
  @IsNotEmpty()
  @IsPhoneNumber('CA')
  manufacturerPhone: string;

  @ApiProperty({
    description: 'Manufacturer email',
    example: faker.internet.email()
  })
  @IsNotEmpty()
  @IsEmail()
  manufacturerEmail: string;

  @ApiProperty({
    description: 'Manufacturer contact',
    example: faker.name.firstName() + faker.name.lastName()
  })
  @IsNotEmpty()
  @IsString()
  manufacturerContact: string;

  @ApiProperty({
    description: 'Concentration of non-therapeutic nicotine as mg/mL',
    example: '100mg/mL'
  })
  @IsNotEmpty()
  concentration: string;

  @ApiProperty({
    description: 'Capacty in mL of container that holds the restricted e-subustance',
    example: '40mL'
  })
  @IsNotEmpty()
  containerCapacity: string;

  @ApiProperty({
    description: 'Capacity in mL of cartridge that hold the restricted e-subustance',
    example: '20mL'
  })
  @IsNotEmpty()
  cartridgeCapacity: string;

  @ApiProperty({
    description: 'List of ingredients, common and scientific names',
    example: ["Water", "Nicojuice"],
  })
  @IsNotEmpty()
  ingredients: string;

  @ApiProperty({
    description: 'Flavour of the substance',
    example: 'Grape Jelly'
  })
  @IsOptional()
  flavour: string;
}
