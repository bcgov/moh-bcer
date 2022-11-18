import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class LocationSearchDTO {
  @ApiProperty({
    description: 'ASC or DESC'
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Business Legal Name, Submitted Date, Health Authority, Doing Business As',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Business Name', 'Business Legal Name', 'Submitted Date', 'Health Authority', 'Doing Business As', 'Location Type', 'Address'])
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  all?: boolean = false;

  @ApiProperty({
    description: 'Comma-separated values, business, noi, products, manufactures',
  })
  @IsString()
  @IsOptional()
  includes?: string;

  @ApiProperty({
    description: 'Search term',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Health Authority',
  })
  @IsString()
  @IsOptional()
  authority?: string;

  @ApiProperty({
    description: 'Location Type',
  })
  @IsString()
  @IsOptional()
  location_type?: string;

  @ApiProperty({
    description: 'Less than 19 allowed?',
  })
  @IsString()
  @IsOptional()
  underage?: string;

  @ApiProperty({
    description: 'NOI Status',
  })
  @IsString()
  @IsOptional()
  noi_report?: string;

  @ApiProperty({
    description: 'Product Report Status',
  })
  @IsString()
  @IsOptional()
  product_report?: string;

  @ApiProperty({
    description: 'Manufacturing Report Status',
  })
  @IsString()
  @IsOptional()
  manufacturing_report?: string;

  @ApiProperty({
    description: 'Sales Report Status',
  })
  @IsString()
  @IsOptional()
  sales_report?: string;

  @ApiProperty({
    description: 'From_Date of the Date Filter',
  })
  @IsString()
  @IsOptional()
  fromdate?: string;

  @ApiProperty({
    description: 'To_Date of the Date Filter',
  })
  @IsString()
  @IsOptional()
  todate?: string;
}