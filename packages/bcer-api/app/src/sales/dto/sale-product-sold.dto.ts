import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';

export class SaleProductSoldDTO {

  @ApiProperty({
    description: 'Sales Report ID',
    example: faker.string.uuid(),
  })
  @IsOptional()
  id: string;
  
  @ApiProperty({
    description: 'Product ID',
    example: faker.string.uuid(),
  })
  @IsOptional()
  productSoldId: string;

  @ApiProperty({
    description: 'Location ID',
    example: faker.string.uuid(),
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
