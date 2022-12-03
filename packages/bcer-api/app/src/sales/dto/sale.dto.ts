import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import * as faker from 'faker/locale/en_CA';

export class SaleDTO {

  @ApiProperty({
    description: 'Sales Report ID',
    example: faker.random.uuid(),
  })
  @IsOptional()
  id: string;
  
  @ApiProperty({
    description: 'Product ID',
    example: faker.random.uuid(),
  })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Location ID',
    example: faker.random.uuid(),
  })
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({
    description: 'Year',
    example: '2020'
  })
  @IsOptional()
  year: string;

  @ApiProperty({
    description: '# of Containers Sold',
    example: '325'
  })
  @IsOptional()
  containers: string;

  @ApiProperty({
    description: '# of Cartridges Sold',
    example: '100'
  })
  @IsOptional()
  cartridges: string;
}
