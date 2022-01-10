import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DirectionDto {
  @ApiProperty({
    description: 'BC Routing link parameter',
  })
  @IsString()
  uri: string;
}
