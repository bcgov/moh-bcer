import { ApiProperty } from '@nestjs/swagger';
import { SubmissionTypeEnum } from 'src/submission/enums/submission.enum';

export class SubmissionRO {

  @ApiProperty()
  id: string;

  @ApiProperty()
  business: string;

  @ApiProperty()
  businessId: string;

  @ApiProperty()
  data: Array<any>;

  @ApiProperty()
  type: SubmissionTypeEnum;
}
