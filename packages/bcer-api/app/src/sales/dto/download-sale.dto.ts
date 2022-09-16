import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DownloadSaleDTO {
  @ApiProperty({
    description: 'location id',
    example: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  locationId: string;

  @ApiProperty({
    description: 'year',
    example: '2020',
  })
  @IsNotEmpty()
  @IsString()
  year: string;
}
