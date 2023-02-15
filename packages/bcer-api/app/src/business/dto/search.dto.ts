import { IsEnum, IsOptional, IsString, IsIn } from "class-validator";
import { HealthAuthority } from "src/location/enums/health-authority.enum";
import { BusinessSearchCategory } from "../enums/businessSearchCategory.enum";
import { ApiProperty } from "@nestjs/swagger";

export class SearchDto {
  @IsOptional()
  search: string;

  @IsOptional()
  @IsEnum(BusinessSearchCategory)
  category: BusinessSearchCategory;

  @IsOptional()
  @IsEnum(HealthAuthority)
  healthAuthority: HealthAuthority;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;

  @ApiProperty({
    description: 'ASC or DESC'
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Business Name, Address, City',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Business Name', 'Address', 'City'])
  orderBy?: string;
}