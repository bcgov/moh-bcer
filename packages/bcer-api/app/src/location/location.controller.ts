import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { LocationService } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { ProductsService } from 'src/products/products.service';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { GeoCodeService } from './geoCode.service';
import { LocationContactDTO } from './dto/locationContact.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Locations')
@Controller('location')
export class LocationController {
  constructor(
    public service: LocationService,
    private geoCodeService: GeoCodeService,
  ){}

  @ApiOperation({ summary: 'Get Locations' })
  @ApiResponse({ status: HttpStatus.OK, type: [LocationRO] })
  @ApiQuery({
    name: 'includes',
    description: 'Comma separated list of relations to includes. For all: business,nois,products,manufactures',
    required: false,
  })
  @ApiQuery({
    name: 'count',
    description: 'Comma separated list of relations to find if relations exist. For all: products,manufactures,sales',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getLocation(
    @Request() req: RequestWithUser,
    @Query('includes') includes: string,
    @Query('count') count: string,
  ): Promise<LocationRO[]> {
    const locations = await this.service.getBusinessLocations(req.ctx.businessId, includes, count)
    return locations.map(location => location.toResponseObject())
  }

  @ApiOperation({ summary: 'Determines the health authority the given coordinates is in' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get('determine-health-authority')
  async determineHealthAuthority(
    @Request() req: RequestWithUser,
    @Query('lat') lat: number,
    @Query('long') lng: number
  ){
    return this.geoCodeService.determineHealthAuthority(lat, lng);
  }
   
  @ApiOperation({ summary: 'Get Single Location' })
  @ApiParam({
    name: 'includes',
    description: 'Comma separated list of relations to includes. For all: business,nois,products,manufactures'
  })
  @ApiResponse({ status: HttpStatus.OK, type: LocationRO })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get(':locationId')
  async getSingleLocation(
    @Request() req: RequestWithUser,
    @Param('locationId') id: string,
    @Query('includes') includes: string,
  ): Promise<LocationRO> {
    const location = await this.service.getLocation(id, includes);
    if (location.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this location');
    }
    return location.toResponseObject();
  }

  /**
   * 
   * Close location
   */
  @ApiOperation({ summary: 'Close Single Location' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch('/close/:locationId')
  async closeSingleLocation(
    @Request() req: RequestWithUser,
    @Param('locationId') id: string,
    @Query('closedTime') closedTime: number
  ): Promise<void> {
    const location = await this.service.getLocation(id);
    if (location && location.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this location');
    }
    // close location
    await this.service.closeLocation([id], closedTime);
  }

  /**
   * 
   * Delete location
   */
    @ApiOperation({ summary: 'Soft Delete Single Location' })
    @ApiResponse({ status: HttpStatus.OK })
    @HttpCode(HttpStatus.OK)
    @Roles('user')
    @UseGuards(BusinessGuard)
    @Patch('/delete/:locationId')
    async deleteSingleLocation(
      @Request() req: RequestWithUser,
      @Param('locationId') id: string,
    ): Promise<void> {
      const location = await this.service.getLocation(id);
      if (location && location.businessId !== req.ctx.businessId) {
        throw new ForbiddenException('This user does not have access to this location');
      }
      // close location
      await this.service.deleteLocation([id]);
    }

  /**
   * 
   * Edit location
   */
  @ApiOperation({ summary: 'Edit Single Location' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch('/edit/:locationId')
  async editSingleLocation(
    @Request() req: RequestWithUser,
    @Param('locationId') id: string,
    @Body() payload: any
  ){
    const location = await this.service.getLocation(id);
     if (location && location.businessId !== req.ctx.businessId) {
       throw new ForbiddenException('This user does not have access to this location');
     }
     await this.service.updateLocation(id, payload);
     return await this.service.getLocationsWithBusinessId(location?.businessId);
  }

  /**
   * 
   * Update multiple contact info
   */
   @ApiOperation({ summary: 'Update contact info for multiple locations' })
   @ApiResponse({ status: HttpStatus.OK })
   @HttpCode(HttpStatus.OK)
   @Roles('user')
   @UseGuards(BusinessGuard)
   @Patch('/update-contact')
   async updateMassContactInfo(@Request() req: RequestWithUser, @Body() payload: LocationContactDTO) {
     const result = await this.service.updateMultipleLocationContactInfo(payload, req.ctx.businessId);
     return ({
       success: result.affected || 0,
       fail: payload.ids.length - (result.affected || 0)
     });
   }
}
