import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Keycloak, Token } from 'keycloak-connect';
import { KEYCLOAK_INSTANCE } from '../constants';
import { META_ALLOW_ANY_ROLE } from '../decorators/allowAnyRole.decorator';
import { META_ROLES } from '../decorators/roles.decorator';
  
/**
 * A permissive type of role guard. Roles are set via `@Roles` decorator.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private keycloak: Keycloak,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;

  //   const roles = this.reflector.get<string[]>(
  //     META_ROLES,
  //     context.getHandler(),
  //   );
  //   const allowAnyRole = this.reflector.get<boolean>(
  //     META_ALLOW_ANY_ROLE,
  //     context.getHandler(),
  //   );

  //   // No roles given, since we are permissive, allow
  //   if (!roles) {
  //     return true;
  //   }

  //   const request = context.switchToHttp().getRequest();
  //   const { accessTokenJWT } = request;

  //   if (!accessTokenJWT) {
  //     // No access token attached, auth guard should have attached the necessary token
  //     throw new UnauthorizedException(
  //       'No access token received from auth guard',
  //     );
  //   }

  //   // Create grant
  //   const grant = await this.keycloak.grantManager.createGrant({
  //     access_token: accessTokenJWT,
  //   });
  //   // Grab access token from grant
  //   const accessToken: Token = grant.access_token as any;
  //   const isInRole = allowAnyRole
  //     ? roles.some(r => accessToken.hasRole(r))
  //     : roles.every(r => accessToken.hasRole(r));

  //   return isInRole;
  }
}