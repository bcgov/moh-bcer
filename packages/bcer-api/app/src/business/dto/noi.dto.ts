import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';

export class NoiDTO {
  @ApiProperty({
    description: 'User provided ID for this location',
    example: faker.string.uuid(),
  })
  @IsNotEmpty()
  locationId: string;
}