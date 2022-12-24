import { ApiProperty } from '@nestjs/swagger';
import { LocationRO } from 'src/location/ro/location.ro';
import { ManufacturingRO } from 'src/manufacturing/ro/manufacturing.ro';
import { NoiRO } from 'src/noi/ro/noi.ro';
import { ProductRO } from 'src/products/ro/product.ro';
import { BusinessReportingStatusRO } from './businessReportingStatus.ro';
import { BusinessStatus } from '../enums/business-status.enum';

export class BusinessRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  legalName: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  webpage: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty()
  addressLine2: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postal: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  users: string[];

  @ApiProperty()
  locations?: LocationRO[];

  @ApiProperty()
  nois?: NoiRO[];

  @ApiProperty()
  products?: ProductRO[];

  @ApiProperty()
  manufactures?: ManufacturingRO[];

  @ApiProperty()
  submissions?: string[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  reportingStatus?: BusinessReportingStatusRO;

  @ApiProperty()
  complianceStatus?: BusinessReportingStatusRO;

  @ApiProperty()
  status: BusinessStatus;
}
