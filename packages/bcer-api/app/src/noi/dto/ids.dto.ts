import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { faker } from '@faker-js/faker/locale/en_CA';

export class IdsDTO {
  @ApiProperty({
    description: 'list of location uuids',
    example: faker.string.uuid(),
  })
  @IsNotEmpty()
  @IsUUID('all', {each: true})
  locationIds: string[];
}