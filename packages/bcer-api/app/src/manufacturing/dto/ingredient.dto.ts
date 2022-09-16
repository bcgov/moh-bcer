import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class IngredientDTO {

  @ApiProperty({
    description: 'Ingredient name',
    example: 'Cherry Vape Juice'
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf(o => !o.scientificName)
  name: string;

  @ApiProperty({
    description: 'Ingredient scientific name',
    example: 'Holis Dicerisium'
  })
  @ValidateIf(o => !o.name)
  @IsNotEmpty()
  @IsString()
  scientificName: string;

  @ApiProperty({
    description: 'The name of the manufacturer for this ingredient',
    example: 'Vape supply co'
  })
  @IsNotEmpty()
  @IsString()
  manufacturerName: string;

  @ApiProperty({
    description: 'The address of the manufacturer for this ingredient',
    example: '123 Vape supply dr'
  })
  @IsNotEmpty()
  @IsString()
  manufacturerAddress: string;

  @ApiProperty({
    description: 'The phone number of the manufacturer for this ingredient',
    example: '7788887777'
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('CA')
  manufacturerPhone: string;

  @ApiProperty({
    description: 'The email address of the manuacturer for this ingredient',
    example: 'hi@vapesupply.co'
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  manufacturerEmail: string;
}
