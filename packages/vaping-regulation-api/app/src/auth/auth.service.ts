import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
const Keycloak = require('keycloak-connect');
import { KEYCLOAK_INSTANCE } from './constants';

import { UserRO } from 'src/user/ro/user.ro'

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
}
