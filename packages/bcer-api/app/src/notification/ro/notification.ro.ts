import { ApiProperty } from '@nestjs/swagger';
import { ErrorDataType } from '../dto/notification-report.dto';

export class NotificationRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  success: number;

  @ApiProperty()
  fail: number;

  @ApiProperty()
  errorData: ErrorDataType;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  sender: string;

  @ApiProperty()
  pending: string[];

  @ApiProperty()
  sent: string[];
}
