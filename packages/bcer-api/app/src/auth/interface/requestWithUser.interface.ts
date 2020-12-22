import { Request } from 'express';

export interface RequestWithUser extends Request {
  ctx: {
    bceidGuid: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
    businessId?: string;
    bceid?: string;
  }
}