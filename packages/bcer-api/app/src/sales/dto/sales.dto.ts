import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import * as faker from 'faker/locale/en_CA';

import { SaleDTO } from './sale.dto';

export class SalesReportDTO {

  @ApiProperty({
    description: 'Sales',
    type: [SaleDTO]
  })
  @IsNotEmpty()
  sales: SaleDTO[];
  
}
