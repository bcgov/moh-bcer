import { SetMetadata } from '@nestjs/common';

export const META_ALLOW_ANY_ROLE = 'allowAnyRole';

/**
 * Allow any role specified in the `@Roles` decorator.
 */
export const AllowAnyRole = () => SetMetadata(META_ALLOW_ANY_ROLE, true);