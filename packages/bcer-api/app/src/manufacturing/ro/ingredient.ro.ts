import { ApiProperty } from '@nestjs/swagger';

export class IngredientRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  scientificName: string;

  @ApiProperty()
  manufacturerName: string;

  @ApiProperty()
  manufacturerAddress: string;

  @ApiProperty()
  manufacturerPhone: string;

  @ApiProperty()
  manufacturerEmail: string;

  @ApiProperty()
  manufactured: string[];
}
