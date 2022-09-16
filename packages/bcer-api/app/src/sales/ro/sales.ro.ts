import { ApiProperty } from '@nestjs/swagger';
import { ProductSoldRO } from 'src/product-sold/ro/product-sold.ro';
import { ProductRO } from 'src/products/ro/product.ro';

export class SalesReportRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  containers: string;

  @ApiProperty()
  cartridges: string;

  @ApiProperty()
  year: string;

  @ApiProperty()
  product: ProductRO;

  @ApiProperty()
  productSold: ProductSoldRO;
}
