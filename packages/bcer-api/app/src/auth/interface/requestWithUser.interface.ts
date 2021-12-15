import { Request } from 'express';

export interface RequestWithUser extends Request {
  ctx: {
    bceidGuid: string;
    bceidUser: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
    businessId?: string;
    bceid?: string;
  }
  user?: any,
}