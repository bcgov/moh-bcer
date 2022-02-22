import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnprocessableEntityException,
  UseGuards,
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
import { BusinessService } from 'src/business/business.service';
import { BusinessDTO } from 'src/business/dto/business.dto';
import { BusinessRO } from 'src/business/ro/business.ro';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { BusinessOverviewDto } from './dto/businessOverview.dto';
import { SearchDto } from './dto/search.dto';
import { LocationRO } from 'src/location/ro/location.ro';
import { LocationService } from 'src/location/location.service';
import { BusinessReportingStatusRO } from './ro/businessReportingStatus.ro';


@ApiTags('business')
@UseGuards(AuthGuard, RoleGuard)
@Controller('business')
export class BusinessController {
  constructor(
    public businessService: BusinessService,
    public locationService: LocationService
  ){}

  @ApiOperation({ summary: 'Submit business details' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Patch()
  async patchBusiness(
    @Body() payload: BusinessDTO,
  ): Promise<BusinessRO> {
    const business = await this.businessService.createBusiness(payload);
    return business.toResponseObject();
  }

  @ApiOperation({ summary: 'Get Business by ID' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiParam({
    name: 'includes',
    description: 'Comma separated list of relations to includes. eg: locations'
  })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getBusiness(
    @Request() req: RequestWithUser,
    @Query('includes') includes: string,
  ): Promise<BusinessRO> {
    const business = await this.businessService.getBusinessById(req.ctx.businessId, includes);
    return business.toResponseObject();
  }

  @ApiOperation({ summary: 'Clear Businesses' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Delete()
  async clearBusinesses(): Promise<BusinessRO[]> {
    await this.businessService.clearBusinesses();
    return;
  }

  @ApiOperation({ summary: 'gets report/compliance report for all business location' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles('user')
  @Get('/report-overview')
  async getLocationReportingOverview(
    @Request() req: RequestWithUser,
  ) 
    :Promise<{locations: LocationRO[], overview: Partial<BusinessReportingStatusRO>}> {
    if(!req.ctx.businessId){
      throw new UnprocessableEntityException('Business id is required!')
    }
    return await this.locationService.getReportingStatus(req.ctx.businessId);
  }
}
