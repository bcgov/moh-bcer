import { ApiProperty } from "@nestjs/swagger";

export class ProductSoldRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandName: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  concentration: string;

  @ApiProperty()
  containerCapacity: string;

  @ApiProperty()
  cartridgeCapacity: string;

  @ApiProperty()
  flavour: string;

  @ApiProperty()
  upc: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}