import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import * as faker from 'faker/locale/en_CA';

export class NoiDTO {

  @ApiProperty({
    description: 'User provided ID for this location',
    example: faker.random.uuid(),
  })
  @IsNotEmpty()
  locationId: string;
}
