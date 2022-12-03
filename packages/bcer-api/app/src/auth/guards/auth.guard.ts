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
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';


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
    const token =
      this.extractJwtFromCookie(request.cookies) ??
      this.extractJwt(request.headers);

    try {
      const jwksClient = jwksRsa({ jwksUri: `${process.env.KEYCLOAK_AUTH_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs` });
      const decoded = jwt.decode(token, { complete: true });
      const kid = decoded['header']?.kid;
      const jwks = await jwksClient.getSigningKeyAsync(kid);
      const signingKey = jwks.getPublicKey();
      const verified = jwt.verify(token, signingKey);
      if (verified['azp'] !== process.env.KEYCLOAK_CLIENT) {
        throw new UnauthorizedException('Token has invalid authorized party');
      }
      request.user = {
        bceidGuid: verified['bceid_user_guid'],
        bceidUser: verified['preferred_username'],
        email: verified['email'],
        firstName: verified['given_name'],
        lastName: verified['family_name'],
      }
      request.accessTokenJWT = token;
      return true;
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
