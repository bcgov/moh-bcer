import { IsEnum, IsOptional } from "class-validator";
import { BusinessReportType } from "../enums/businessReportType.enum";

export class BusinessOverviewDto {
  @IsOptional()
  @IsEnum(BusinessReportType)
  type: BusinessReportType;
}