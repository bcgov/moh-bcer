import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import * as faker from 'faker/locale/en_CA';

export class IdsDTO {
  @ApiProperty({
    description: 'list of location uuids',
    example: faker.random.uuid(),
  })
  @IsNotEmpty()
  @IsUUID('all', {each: true})
  locationIds: string[];
}