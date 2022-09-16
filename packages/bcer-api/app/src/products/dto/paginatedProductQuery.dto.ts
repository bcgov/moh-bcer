import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginatedProductQuery {
  @IsOptional()
  @Min(1)
  @IsNumber()
  page: number;

  @IsOptional()
  @Min(1)
  @IsNumber()
  perPage: number;
}