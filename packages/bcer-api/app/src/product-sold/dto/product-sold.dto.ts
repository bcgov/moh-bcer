import { ApiProperty } from '@nestjs/swagger';
import {

  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductSoldDTO {

  // @ApiProperty({
  //   description: 'businessId',
  //   example: 'uuid'
  // })
  // @IsNotEmpty()
  // @IsUUID()
  // businessId: string;

  // @ApiProperty({
  //   description: 'locationId',
  //   example: 'uuid'
  // })
  // @IsNotEmpty()
  // @IsUUID()
  // locationId: string;

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
    description: 'Flavour of the substance',
    example: 'Grape Jelly'
  })
  @IsOptional()
  flavour: string;

  @ApiProperty({
      description:'UPC',
      example: 'Unique Number of Product'
  })
  @IsOptional()
  upc: string;
}
