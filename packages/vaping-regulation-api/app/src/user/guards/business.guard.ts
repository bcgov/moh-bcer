import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BusinessGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (!req.ctx?.businessId) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
