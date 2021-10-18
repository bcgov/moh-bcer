import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { LocationRO } from 'src/location/ro/location.ro';
import { NoiRO } from 'src/noi/ro/noi.ro';
import { NoiService } from 'src/noi/noi.service';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { IdsDTO } from './dto/ids.dto';

@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@ApiTags('Notice of Intent')
@Controller('noi')
export class NoiController {
  constructor(
    public noiService: NoiService,
    public userService: UserService,
  ){}

  @ApiOperation({ summary: 'Submit an Noi' })
  @ApiResponse({ status: HttpStatus.CREATED, type: [LocationRO] })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Post()
  async submitNoi(
    @Request() req: RequestWithUser,
    @Body() { locationIds }: IdsDTO,
  ): Promise<LocationRO[]> {
    const locations = await this.noiService.createOrRenewNois(locationIds, req.ctx.businessId);
    return locations.map(l => l.toResponseObject());
  }

  @ApiOperation({ summary: 'Get NOI data' })
  @ApiResponse({ status: HttpStatus.OK, type: [NoiRO] })
  @HttpCode(HttpStatus.OK)
  @UseGuards(BusinessGuard)
  @Roles('user')
  @Get()
  async getNoi(@Request() req: RequestWithUser): Promise<NoiRO[]> {
    const nois = await this.noiService.getNois(req.ctx.businessId)
    return nois.map(noi => noi.toResponseObject())
  }
}
