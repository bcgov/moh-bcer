import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';


import { SaleDTO } from './sale.dto';

export class SalesReportDTO {

  @ApiProperty({
    description: 'Sales',
    type: [SaleDTO]
  })
  @IsNotEmpty()
  sales: SaleDTO[];
  
}
