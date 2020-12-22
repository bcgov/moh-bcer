import { ApiProperty } from '@nestjs/swagger';
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

}
