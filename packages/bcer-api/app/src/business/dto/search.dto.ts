import { IsEnum, IsOptional, IsString, IsIn, IsInt, Min } from "class-validator";
import { HealthAuthority } from "src/location/enums/health-authority.enum";
import { BusinessSearchCategory } from "../enums/businessSearchCategory.enum";
import { ApiProperty } from "@nestjs/swagger";
import { BusinessReportList } from "../enums/businessReportList.enum";

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
  @IsEnum(BusinessReportList) 
  reports: BusinessReportList;

  @ApiProperty({
    description: 'Index starts at 1',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;

  @IsInt()
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