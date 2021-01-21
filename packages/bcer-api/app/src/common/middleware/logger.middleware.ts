import { Injectable, NestMiddleware, Inject, Logger, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private logger: LoggerService
  ) {}

  async use(req: RequestWithUser, res: Response, next: Function) {
    this.logger.log(`${new Date}: ${req.ctx?.bceidGuid || 'unknown'} sent a ${req.method} request to ${req.originalUrl}`);
    next();
  }
}
