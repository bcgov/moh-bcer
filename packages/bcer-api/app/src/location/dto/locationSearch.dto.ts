import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional, IsNumber, Min } from 'class-validator';

export class LocationSearchDTO {
  @ApiProperty({
    description: 'ASC or DESC'
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Business Legal Name, Submitted Date, Health Authority',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Business Legal Name', 'Submitted Date', 'Health Authority'])
  orderBy?: string = 'Submitted Date';

  @ApiProperty({
    description: 'Index starts at 1',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  numPerPage?: number = 10;

  @ApiProperty({
    description: 'Comma-separated values, business, noi, products, manufactures',
  })
  @IsString()
  @IsOptional()
  includes?: string;
}