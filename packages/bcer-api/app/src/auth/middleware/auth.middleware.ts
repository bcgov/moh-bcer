import { Injectable, NestMiddleware, Inject, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RequestWithUser } from '../interface/requestWithUser.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(AuthService) private authService: AuthService,
  ) {}

  async use(req: RequestWithUser, res: Response, next: Function) {
    const authorization = req.headers['authorization'];
    const path = req.originalUrl;
    // Because the middleware `excludes` doesn't work for a wildcard
    if (path.includes('data/location')) { next(); }
    else if (authorization) {
      try {
        const profile = await this.authService.getProfile(authorization);
        if (profile.bceid_user_guid) {
          req.ctx = {
            bceidGuid: profile.bceid_user_guid || profile.sub || profile.id,
            bceidUser: profile.preferred_username,
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
          };
        }
      } catch (error) {
        throw new UnauthorizedException('Failed to retrieve user profile')
      }
      next();
    } else {
      next();
    }
  }
}
