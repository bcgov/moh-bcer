import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
const Keycloak = require('keycloak-connect');
import { KEYCLOAK_INSTANCE, ROLES } from './constants';

import { PermissionRO, UserRO } from 'src/user/ro/user.ro'
import { RequestWithUser } from './interface/requestWithUser.interface';

/**
 * AuthService
 * Handles authentication-related logic
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private keycloak: typeof Keycloak,
  ) {}

  /**
   * Gets the credentials to pass into Keycloak's grant manager
   * @param token Access token
   */
  private async extractJwt(token?: string): Promise<string | undefined> {
    const tokenParts = token?.split(' ');
    if (tokenParts && tokenParts[0].toLowerCase() === 'bearer')
      return tokenParts[1];
    return undefined;
  }

  /**
   * Gets the user profile from Keycloak
   * @param token Access token
   */
  // TODO NF: Flesh out once we know what to return
  private async getUserData(token: string): Promise<any> {
    return this.keycloak.grantManager.userInfo(token);
  }

  private async signJwt(user: UserRO): Promise<string> {
    const accessToken = jwt.sign(
      {
        id: user.id,
        bceid: user.bceid,
        user_type: user.type,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    return accessToken;
  }

  /**
   * Gets user profile from Keycloak
   * @param authToken JWT token passed from FE
   */
  async getProfile(authToken?: string): Promise<any> {
    const jwt = await this.extractJwt(authToken);
    if (jwt)
      return await this.getUserData(jwt);
    throw new UnauthorizedException('No token provided');
  }

  getPermissions(req: RequestWithUser): PermissionRO {
    const rolePermissions = {
      MANAGE_LOCATIONS: [ROLES.HA_ADMIN, ROLES.MOH_ADMIN],
      MANAGE_USERS: [ROLES.MOH_ADMIN],
      SEND_TEXT_MESSAGES: [ROLES.MOH_ADMIN],
      PLAN_ROUTES: [ROLES.HA_ADMIN, ROLES.MOH_ADMIN],
      VIEW_SALES: [ROLES.MOH_ADMIN],
      MANAGE_FAQ: [ROLES.MOH_ADMIN],
    };

    const featureFlags = {
      TEXT_MESSAGES: process.env.ENABLE_TEXT_MESSAGES === 'true'
    };
    
    const userRoles = req.user?.roles || [];
    try {
      console.log('AuthService.getPermissions called with:', { user: req.user });
      const permissions: {[key: string]: boolean} = Object.entries(rolePermissions).reduce((acc, [permissionName, roles]) => {
        const hasPermission = roles.some(role => userRoles.includes(role));
        return { ...acc, [permissionName]: hasPermission };
      }, {});

      return {
        permissions,
        featureFlags
      };
    } catch (error) {
      console.error('Error in AuthService.getPermissions:', error);
      throw error;
    }
  }
}
