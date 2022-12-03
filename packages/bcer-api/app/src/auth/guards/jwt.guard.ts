import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }

    req.user = this.validateToken(req.headers.authorization);
    return true;
  }

  validateToken(auth: string) {
    const authSplit = auth.split(' ');
    if (authSplit[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    const token = authSplit[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}