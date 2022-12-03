import { ApiProperty } from '@nestjs/swagger';

export class ProductUploadRO {
  @ApiProperty()
  productUploadId: string;

  @ApiProperty()
  productCount: number;

  @ApiProperty()
  dateSubmitted: string;
}
