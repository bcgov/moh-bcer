import { ApiProperty } from '@nestjs/swagger';
import { IngredientRO } from 'src/manufacturing/ro/ingredient.ro';
import { LocationRO } from 'src/location/ro/location.ro';

export class ManufacturingRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  ingredients: IngredientRO[];

  @ApiProperty()
  locations: LocationRO[];

  @ApiProperty()
  business?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
