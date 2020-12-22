import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  bceid: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
