import { ApiProperty } from '@nestjs/swagger';
import { LocationRO } from 'src/location/ro/location.ro';
import { ProductRO } from './product.ro';

export class ProductsLocationsRO {
  @ApiProperty()
  products: ProductRO[];

  @ApiProperty()
  locations: LocationRO[];
}
