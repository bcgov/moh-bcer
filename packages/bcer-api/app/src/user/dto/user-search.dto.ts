import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserSearchTypes } from '../enums/user-search-type.enum';

export class UserSearchDTO {
  @ApiProperty({ description: 'Search category' })
  @IsOptional()
  @IsEnum(UserSearchTypes)
  type: UserSearchTypes;

  @ApiProperty({ description: 'Search string' })
  @IsOptional()
  @IsString()
  search: string;
}
