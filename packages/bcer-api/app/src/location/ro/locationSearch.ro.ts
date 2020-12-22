import { ApiProperty } from '@nestjs/swagger';
import { LocationRO } from 'src/location/ro/location.ro';

export class LocationSearchRO {
  @ApiProperty()
  rows: LocationRO[];

  @ApiProperty()
  pageNum: number;

  @ApiProperty()
  totalRows: number;
}