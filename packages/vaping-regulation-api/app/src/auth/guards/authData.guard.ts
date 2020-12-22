import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

@Injectable()
export class AuthDataGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwt(request.headers);
      
    try {
      const jwksClient = jwksRsa({ jwksUri: `${process.env.KEYCLOAK_DATA_AUTH_URL}/realms/${process.env.KEYCLOAK_DATA_REALM}/protocol/openid-connect/certs` });
      const decoded = jwt.decode(token, { complete: true });
      const kid = decoded['header']?.kid;
      const jwks = await jwksClient.getSigningKeyAsync(kid);
      const signingKey = jwks.getPublicKey();
      const verified = jwt.verify(token, signingKey);
      if (verified['azp'] !== process.env.KEYCLOAK_DATA_CLIENT) {
        throw new UnauthorizedException('Token has invalid authorized party');
      }
      if (!verified['resource_access'] ||
          !verified['resource_access'][process.env.KEYCLOAK_DATA_CLIENT] ||
          !verified['resource_access'][process.env.KEYCLOAK_DATA_CLIENT].roles?.includes('bcer_admin')) {
        throw new UnauthorizedException('User does not have bcer_admin role for this realm');
      }
      // Attach user info object
      request.user = {
        bceidGuid: verified['sub'] || verified['id'],
        email: verified['email'],
        firstName: verified['given_name'],
        lastName: verified['family_name'],
      }
      // Attach raw access token JWT extracted from bearer/cookie
      request.accessTokenJWT = token;
      return true;
    } catch (ex) {
      console.error(`validateAccessToken Error: `, ex);
      throw ex;
    }
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
}
