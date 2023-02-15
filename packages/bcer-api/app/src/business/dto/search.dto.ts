import { IsEnum, IsOptional } from "class-validator";
import { HealthAuthority } from "src/location/enums/health-authority.enum";
import { BusinessSearchCategory } from "../enums/businessSearchCategory.enum";

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
}