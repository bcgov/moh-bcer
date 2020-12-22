import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

/**
 * Keycloak user roles.
 * @param roles - roles that are associated with the resource
 */
export const Roles = (...roles: string[]) => SetMetadata(META_ROLES, roles);