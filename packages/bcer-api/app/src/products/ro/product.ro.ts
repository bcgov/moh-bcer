import { ApiProperty } from '@nestjs/swagger';

export class ProductRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  brandName: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  manufacturerName: string;

  @ApiProperty()
  manufacturerAddress: string;

  @ApiProperty()
  manufacturerPhone: string;

  @ApiProperty()
  manufacturerEmail: string;

  @ApiProperty()
  manufacturerContact: string;

  @ApiProperty()
  concentration: string;

  @ApiProperty()
  containerCapacity: string;

  @ApiProperty()
  cartridgeCapacity: string;

  @ApiProperty()
  ingredients: string;

  @ApiProperty()
  flavour: string;

  @ApiProperty()
  locationIds?: string[];

  @ApiProperty()
  productUploadId?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
