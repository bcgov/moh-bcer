import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';

import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity';
import { ManufacturingDTO } from 'src/manufacturing/dto/manufacturing.dto';
import { ManufacturingRO } from 'src/manufacturing/ro/manufacturing.ro';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationRO } from 'src/location/ro/location.ro';
import { ROLES } from 'src/auth/constants';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Manufacturing')
@Controller('manufacturing')
export class ManufacturingController {
  constructor(
    public service: ManufacturingService,
  ){}

  @ApiOperation({ summary: 'Create manufacturing report' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ManufacturingRO })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch()
  async createManufacturingReport(
    @Body() payload: ManufacturingDTO,
    @Request() req: RequestWithUser,
    ): Promise<ManufacturingRO> {
    const manufacturingReport = await this.service.createManufacturingReport(payload, req.ctx.businessId);
    return manufacturingReport.toResponseObject();
  }

  @ApiOperation({ summary: 'Get Manufacturing' })
  @ApiResponse({ status: HttpStatus.OK, type: [ManufacturingRO] })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getManufacturing(
    @Request() req: RequestWithUser,
  ): Promise<ManufacturingRO[]> {
    const manufacturing = await this.service.getManufacturing(req.ctx.businessId)
    return manufacturing.map((manufacturing: ManufacturingEntity) => manufacturing.toResponseObject())
  }

  @ApiOperation({ summary: 'Get Manufacturing Locations' })
  @ApiResponse({ status: HttpStatus.OK, type: [LocationRO] })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get('locations')
  async getManufacturingLocations(
    @Request() req: RequestWithUser
  ): Promise<LocationRO[]> {
    const locations = await this.service.getManufacturingLocations(req.ctx.businessId)
    return locations.map((location: LocationEntity) => location.toResponseObject())
  }

  @ApiOperation({ summary: 'Get Manufacturing Report by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: [ManufacturingRO] })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get('/:reportId')
  async getManufacturingReportById(
    @Request() req: RequestWithUser,
    @Param('reportId') reportId: string
  ): Promise<ManufacturingRO> {
    const manufacturing = await this.service.getManufacturingReportById(reportId);
    if (manufacturing.business.id !== req.ctx.businessId) {
      throw new ForbiddenException(`User does not have access to report ${reportId}`);
    }
    return manufacturing.toResponseObject();
  }

  @ApiOperation({ summary: 'Soft Delete Manufacturing Report by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.USER)
  @UseGuards(BusinessGuard)
  @Delete('/:reportId')
  async deleteManufacturingReportById(
    @Request() req: RequestWithUser,
    @Param('reportId') reportId: string
  ): Promise<string> {
    const manufacturing = await this.service.getManufacturingReportById(reportId);
    if (manufacturing.business.id !== req.ctx.businessId) {
      throw new ForbiddenException(`User does not have access to report ${reportId}`);
    }
    await this.service.softDeleteManufacturing(reportId);
    return 'ok';
  }
}
