import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { KeycloakConnectOptions } from './interface/keycloakConnectOptions.interface';
import { KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE } from 'src/auth/constants';
import * as crypto from 'crypto';
const Keycloak = require('keycloak-connect');

const IV = '962d7949d38e6f1e';
const SALT = 'fc1cadcfa5fd2623113b0e256b799710';
const ALGO = 'aes-256-cbc';

export * from './decorators/scopes.decorator';
export * from './decorators/roles.decorator';
export * from './decorators/allowAnyRole.decorator';
export * from './decorators/unprotected.decorator';
export * from './guards/auth.guard';
export * from './guards/role.guard';

/**
 * AuthModule
 * Handles Keycloak registration and any authentication-related functions
 */
@Module({
  providers: [AuthService],
})
class AuthModuleSetup {
  /**
   * Register the Keycloak instance
   * @param opts Client information for Keycloak
   */
  public static register(opts: KeycloakConnectOptions): DynamicModule {
    const optsProvider = {
      provide: KEYCLOAK_CONNECT_OPTIONS,
      useValue: opts,
    };

    return {
      global: true,
      module: AuthModuleSetup,
      providers: [optsProvider, this.keycloakProvider],
      exports: [optsProvider, this.keycloakProvider],
    };
  }

  /**
   * Generate the keycloak instance using envs
   */
  private static keycloakProvider: Provider = {
    provide: KEYCLOAK_INSTANCE,
    useFactory: (opts: any) => {
      const keycloakOpts: any = opts;
      const keycloak: any = new Keycloak({}, keycloakOpts);

      keycloak.accessDenied = (req: any, res: any, next: any) => {
        req.resourceDenied = true;
        next();
      };

      return keycloak;
    },
    inject: [KEYCLOAK_CONNECT_OPTIONS]
  }
}

const decipher = crypto.createDecipheriv(ALGO, SALT, IV);
const decryptedKeycloakSecret = process.env.KEYCLOAK_SECRET ? Buffer.concat([decipher.update(Buffer.from(process.env.KEYCLOAK_SECRET, 'hex')), decipher.final()]).toString() : '';

export const AuthModule = AuthModuleSetup.register({
  'realm': process.env.KEYCLOAK_REALM,
  'authServerUrl': process.env.KEYCLOAK_AUTH_URL,
  'clientId': process.env.KEYCLOAK_CLIENT,
  'secret': decryptedKeycloakSecret,
});
