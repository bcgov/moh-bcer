import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Keycloak } from 'keycloak-connect';
import { KeycloakConnectOptions } from '../interface/keycloakConnectOptions.interface';
import { META_UNPROTECTED } from '../decorators/unprotected.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('KEYCLOAK_INSTANCE')
    private keycloak: Keycloak,
    @Inject('KEYCLOAK_CONNECT_OPTIONS')
    private keycloakOpts: KeycloakConnectOptions,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isUnprotected = this.reflector.get<boolean>(
      META_UNPROTECTED,
      context.getHandler(),
    );

    // If unprotected is set skip Keycloak authentication
    if (isUnprotected) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwt =
      this.extractJwtFromCookie(request.cookies) ??
      this.extractJwt(request.headers);

    try {
      const result = await this.keycloak.grantManager.validateAccessToken(jwt);
      if (typeof result === 'string') {
        // Attach user info object
        request.user = await this.keycloak.grantManager.userInfo(jwt);
        // Attach raw access token JWT extracted from bearer/cookie
        request.accessTokenJWT = jwt;
        return true;
      }
    } catch (ex) {
      console.error(`validateAccessToken Error: `, ex);
    }
    throw new UnauthorizedException('Invalid token');
  }

  extractJwt(headers: { [key: string]: string }) {
    if (headers && !headers.authorization) {
      throw new UnauthorizedException('No auth header provided');
    }

    const auth = headers.authorization.split(' ');
    // We only allow bearer
    if (auth[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Authorization header malformed');
    }
    return auth[1];
  }

  extractJwtFromCookie(cookies: { [key: string]: string }) {
    return cookies && cookies[this.keycloakOpts.cookieKey] || cookies && cookies.KEYCLOAK_JWT;
  }
}
