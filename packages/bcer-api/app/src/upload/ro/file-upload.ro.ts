import { ApiProperty } from '@nestjs/swagger';

export class LocationsFileUploadRO {
  @ApiProperty()
  submissionId: string;
  @ApiProperty()
  headers: string[];
  @ApiProperty()
  locations?: Object[];
  // NB: generic object array, no way to know object key struture of CSV upload
}

export class ProductsFileUploadRO {
  @ApiProperty()
  submissionId: string;
  @ApiProperty()
  headers: string[];
  @ApiProperty()
  products?: Object[];
  // NB: generic object array, no way to know object key struture of CSV upload
}
