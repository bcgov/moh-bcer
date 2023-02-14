import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { LocationService } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { NoiService } from 'src/noi/noi.service';
import { ProductSoldService } from 'src/product-sold/product-sold.service';
import { ProductsService } from 'src/products/products.service';
import { BusinessService } from './business.service';
import { BusinessMergeDTO } from './dto/business-merge.dto';
import { BusinessOverviewDto } from './dto/businessOverview.dto';
import { SearchDto } from './dto/search.dto';
import { BusinessRO } from './ro/business.ro';
import { BusinessReportingStatusRO } from './ro/businessReportingStatus.ro';
import { LocationStatus } from 'src/location/enums/location-status.enum';
import { UserService } from 'src/user/user.service';

@ApiBearerAuth()
@ApiTags('Business')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/business')
export class BusinessDataPortalController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly noiService: NoiService,
    private readonly locationService: LocationService,
    private readonly productsService: ProductsService,
    private readonly manufacturingService: ManufacturingService,
    private readonly productSoldService: ProductSoldService,
    private readonly userService: UserService,
  ) {}
  @ApiOperation({ summary: 'Retrieve all businesses' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: BusinessRO })
  @Roles(ROLES.MOH_ADMIN)
  @Get()
  async getUsers(@Request() req: RequestWithUser): Promise<BusinessRO[]> {
    const payload = {
      relations: ['users'],
    };
    const businesses = await this.businessService.getBusinesses(payload);
    return businesses.map(b => b.toResponseObject());
  }

  @ApiOperation({ summary: 'Merges 2 business data together' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN)
  @Patch('merge')
  async mergeBusiness(@Body() payload: BusinessMergeDTO) {
    const {sourceBusinessId, targetBusinessId} = payload;
    const targetBusiness = await this.businessService.getBusinessById(
      targetBusinessId,
    );
    if (!targetBusiness)
      throw new NotFoundException(
        null,
        'Merge Failed: Target Business Not Found',
      );
    const sourceBusiness = await this.businessService.getBusinessById(
      sourceBusinessId,
    );
    if (!sourceBusiness)
      throw new NotFoundException(
        null,
        'Merge Failed: Source Business Not Found',
      );

    let stepCompleted = 0;
    try {
      await this.locationService.assignLocationsToNewBusiness(sourceBusinessId, targetBusinessId);
      stepCompleted++;
      await this.noiService.assignNoisToNewBusiness(sourceBusinessId, targetBusinessId);
      stepCompleted++;
      await this.productsService.assignProductsToNewBusiness(sourceBusinessId, targetBusinessId);
      stepCompleted++;
      await this.manufacturingService.assignManufacturingToNewBusiness(sourceBusinessId, targetBusinessId);
      stepCompleted++;
      await this.productSoldService.assignProductSoldToNewBusiness(sourceBusinessId, targetBusinessId);

      return 'ok';
    } catch (err) {
      //Add log in database.
      throw err;
    }
  }

  @ApiOperation({ summary: 'gets report/compliance overview' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Get('/overview')
  async getComplianceOverview (@Query() query: BusinessOverviewDto){
     return await this.businessService.getComplianceOverview(query.type);
  }

  @ApiOperation({ summary: 'gets paginated business data with report status summary' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Get('businesses')
  async listBusinesses(@Query() query: SearchDto): Promise<{data: BusinessRO[], count: number}>{
    let businessIds: string[];
    if(query?.healthAuthority){
      businessIds = await this.businessService.getBusinessIdsForHA(query.healthAuthority);
      if(!businessIds?.length){
        return {data: [], count: 0};
      }
    }
    const [businesses, count] = await this.businessService.listBusinesses(query, businessIds);
 
    const data = businesses.map(b => {
      b.reportingStatus = this.locationService.checkLocationReportComplete(b.locations || []);
      b.locations = [];
      return b.toResponseObject();
    });
   
    return { data, count}
  }

  @ApiOperation({ summary: 'gets report/compliance report for all business location' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Get('/report-overview/:businessId')
  async getLocationReportingOverview(@Param('businessId') businessId, @Query() query: BusinessOverviewDto) 
    :Promise<{locations: LocationRO[], overview: BusinessReportingStatusRO}> {
    if(!businessId){
      throw new UnprocessableEntityException('Business id is required!')
    }
    return await this.locationService.getReportingStatus(businessId, query?.type);
  }

  @ApiOperation({ summary: 'gets business info by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Get('/:businessId')
  async getSingleBusiness(@Param('businessId') businessId, @Query('includes') includes: string){
    if(!businessId){
      throw new UnprocessableEntityException('businessId is a required parameter')
    }
    if(includes){
      includes.split(',').forEach((relation) => {
        if(!['noi', 'locations', 'users'].includes(relation)){
          throw new UnprocessableEntityException('Invalid relation. allowed relations: noi,locations,users');
        }
      })
    }
    const business = await this.businessService.getBusinessById(businessId, includes);
    return business?.toResponseObject();
  }

  @ApiOperation({ summary: 'Close a business.' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN)
  @Patch('/close/:businessId')
  async closeBusiness(
    @Param('businessId') businessId: string,
    @Query('closedTime') closedTime: number,
    @Request() req: RequestWithUser) {    
    const user = await this.userService.findByBCeID(req.user.bceidGuid);
    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }

    const business = await this.businessService.getBusinessById(businessId);
    if (!business)
      throw new NotFoundException(
        null,
        'Close Failed: Business Not Found',
      );
    
    const businessLocations = await this.locationService.getBusinessLocations(businessId);

    const hasActiveLocation = businessLocations.some(location => location.status === LocationStatus.Active)

    if (hasActiveLocation) {
      throw new ForbiddenException('Cannot close a business with any active locations.')
    }

    try {
      await this.businessService.closeBusiness(businessId, closedTime, user);   
      await this.userService.unassignBusiness(businessId)
    } catch (err) {
      throw err;
    }
  }
}
