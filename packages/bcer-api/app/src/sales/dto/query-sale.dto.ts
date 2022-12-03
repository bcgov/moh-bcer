import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class QuerySaleDTO {
  @ApiProperty({
    description: 'is Outstanding or is Submitted',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isSubmitted: boolean;
}
