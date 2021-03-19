import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Res,
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
import { Roles, Unprotected } from 'src/auth/auth.module';
import { LocationSearchDTO } from 'src/location/dto/locationSearch.dto';
import { LocationService } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { LocationSearchRO } from 'src/location/ro/locationSearch.ro';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { Response } from 'express';
import { ProductsService } from 'src/products/products.service';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Locations')
@Controller('location')
export class LocationController {
  constructor(
    public service: LocationService,
    private manufacturingService: ManufacturingService,
    private productsService: ProductsService,
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
}
