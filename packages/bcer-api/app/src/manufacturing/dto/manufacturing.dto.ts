import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDTO } from 'src/manufacturing/dto/ingredient.dto';
import * as faker from 'faker/locale/en_CA';

export class ManufacturingDTO {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Fruit Roll Up'
  })
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: 'Ids of the locations where this product is manufactured',
    example: faker.datatype.uuid()
  })
  @IsNotEmpty()
  locationIds: string[];

  @ApiProperty({
    description: 'Ingredients',
    type: [IngredientDTO],
  })
  @IsArray()
  @IsNotEmpty()
  @Type(() => IngredientDTO)
  ingredients: IngredientDTO[];
}
