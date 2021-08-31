import { Controller, ForbiddenException, Get, HttpCode, HttpStatus, Inject, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { Roles, Unprotected } from './auth/auth.module';
import { Request } from 'express';

@ApiTags('base')
@UseGuards(AuthGuard, RoleGuard)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Unprotected()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('envs')
  @Unprotected()
  async getEnvs(): Promise<string> {
    return `${process.env.KEYCLOAK_REALM}-${process.env.KEYCLOAK_CLIENT}`;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profile' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @Roles('user')
  async getProfile(@Req() request: Request): Promise<any> {
    return await this.authService.getProfile(request.headers.authorization);
  }

  @Patch('/heapsnapshot')
  @Unprotected()
  async getHeapSnapShot(): Promise<void> {
    if (!process.env.STOP_HEAPSNAPSHOT || process.env.STOP_HEAPSNAPSHOT != 'true') {
      this.appService.generateHeapSnapShot();
    }
    return;
  }
}
