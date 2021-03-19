import { ApiProperty } from '@nestjs/swagger';
import { HealthAuthority } from 'src/business/enums/health-authority.enum'
import { BusinessRO } from 'src/business/ro/business.ro';
import { ManufacturingRO } from 'src/manufacturing/ro/manufacturing.ro';
import { NoiRO } from 'src/noi/ro/noi.ro';
import { ProductRO } from 'src/products/ro/product.ro';
import { SalesReportRO } from 'src/sales/ro/sales.ro';

export class LocationRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  business: string | BusinessRO;

  @ApiProperty()
  noi: NoiRO | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  webpage: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postal: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  underage: string;

  @ApiProperty()
  underage_other: string;

  @ApiProperty()
  health_authority: HealthAuthority;

  @ApiProperty()
  doingBusinessAs: string;

  @ApiProperty()
  manufacturing: string;

  @ApiProperty()
  manufactures?: ManufacturingRO[];

  @ApiProperty()
  manufacturesCount?: number = 0;

  @ApiProperty()
  products?: ProductRO[];

  @ApiProperty()
  productsCount?: number = 0;

  @ApiProperty()
  sales?: SalesReportRO[];

  @ApiProperty()
  salesCount?: number = 0;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
