import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { getDurationInMilliseconds } from '../../utils/util';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserService)
    private userService: UserService
  ) {}

  async use(req: RequestWithUser, res: Response, next: Function) {
    if (req?.ctx?.bceidGuid) {
      const start = process.hrtime();  
      const user = await this.userService.findByBCeID(req.ctx.bceidGuid);
      Logger.log(`User Middleware after DB call ${getDurationInMilliseconds(start)} ms`);
      if (user) {
        req.ctx.userId = user.id;
        req.ctx.bceid = user.bceid;
        req.ctx.businessId = user.businessId;
      }
    }
    next();
  }
}
