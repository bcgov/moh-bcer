import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProductDTO } from 'src/products/dto/product.dto';
import { faker } from '@faker-js/faker/locale/en_CA';

export class ProductsDTO {
  @ApiProperty({
    description: 'Ids of the locations this product is sold at',
    example: [faker.string.uuid()]
  })
  @IsNotEmpty()
  locationIds: string[];

  @ApiProperty({
    description: 'Array of products',
    type: [ProductDTO]
  })
  @IsNotEmpty()
  products: ProductDTO[];
}
