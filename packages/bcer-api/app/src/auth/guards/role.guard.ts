import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Keycloak, Token } from 'keycloak-connect';
import { KEYCLOAK_INSTANCE, ROLES } from '../constants';
import { META_ALLOW_ANY_ROLE } from '../decorators/allowAnyRole.decorator';
import { META_ROLES } from '../decorators/roles.decorator';
  
/**
 * A permissive type of role guard. Roles are set via `@Roles` decorator.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    const allowAnyRole = this.reflector.get<boolean>(
      META_ALLOW_ANY_ROLE,
      context.getHandler(),
    );

    // No roles given, since we are permissive, allow
    if (!roles || !roles.some(role => [ROLES.HA_ADMIN, ROLES.MOH_ADMIN].includes(role))) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      // No user attached, auth guard should have attached the necessary user
      throw new UnauthorizedException(
        'No user received from auth guard',
      );
    }

    const userRoles = request.user?.roles || [];

    const isInRole = allowAnyRole
      ? roles.some(r => userRoles.includes(r))
      : roles.every(r => userRoles.includes(r));

    return isInRole;
  }
}