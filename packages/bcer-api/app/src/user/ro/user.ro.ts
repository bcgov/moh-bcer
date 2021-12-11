import { UserTypeEnum } from '../enums/user-type.enum';
import { BusinessRO } from 'src/business/ro/business.ro';

export class UserRO {
  id: string;
  bceid: string;
  bceidUser?: string;
  user_status_id: number;
  type: UserTypeEnum;
  email: string;
  firstName: string;
  lastName: string;
  created_at: Date;
  updated_at: Date;
  businessId?: string;
  business?: BusinessRO
}

export class ProfileRO {
  userData: UserRO;
  business: BusinessRO | null;
}

export class StatusRO {
  myBusinessComplete: boolean;
  noiComplete: boolean;
  productReportComplete: boolean;
  manufacturingReportComplete: boolean;
}
