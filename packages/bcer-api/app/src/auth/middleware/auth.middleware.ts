import {
  Injectable,
  NestMiddleware,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { getDurationInMilliseconds } from '../../utils/util';
import { RequestWithUser } from '../interface/requestWithUser.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: Function) {
    const authorization = req.headers['authorization'];
    const path = req.originalUrl;
    // Because the middleware `excludes` doesn't work for a wildcard
    if (
      path.includes('data/location') ||
      path.includes('data/user') ||
      path.includes('data/business') ||
      path.includes('data/notification') ||
      path.includes('data/note') ||
      path.includes('data/products') ||
      path.includes('data/manufacturing')
    ) {
      next();
    } else if (authorization) {
      try {
        const start = process.hrtime();
        const profile = await this.authService.getProfile(authorization);
        Logger.log(
          `Auth Middleware after keycloak call ${getDurationInMilliseconds(
            start,
          )} ms`,
        );
        if (profile.bceid_user_guid || profile.sub) {
          req.ctx = {
            bceidGuid: profile.bceid_user_guid || profile.sub || profile.id,
            bceidUser: profile.preferred_username,
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
          };
        }
      } catch (error) {
        throw new UnauthorizedException('Failed to retrieve user profile');
      }
      next();
    } else {
      next();
    }
  }
}
