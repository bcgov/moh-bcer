import { ApiProperty } from '@nestjs/swagger';

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
}
