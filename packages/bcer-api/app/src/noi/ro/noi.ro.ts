import { ApiProperty } from '@nestjs/swagger';
import { NoiStatus } from '../enums/status.enum';

export class NoiRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  businessId: string;

  @ApiProperty()
  locationId: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  status: NoiStatus;

  @ApiProperty()
  renewed_at: Date;

  @ApiProperty()
  expiry_date: Date;
}
