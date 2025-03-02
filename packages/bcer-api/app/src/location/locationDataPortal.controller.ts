import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
  Param,
  NotFoundException,
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { LocationEntity } from './entities/location.entity';
import { BusinessService } from 'src/business/business.service';
import { LocationSearchDTO } from 'src/location/dto/locationSearch.dto';
import { LocationService, manufacturingLocationTranslation } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { LocationSearchRO } from 'src/location/ro/locationSearch.ro';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { ProductsService } from 'src/products/products.service';
import { SalesReportService } from 'src/sales/sales.service';
import { ROLES } from 'src/auth/constants';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { LocationConfig } from './config/dataLocation.config';
import { DirectionDto } from './dto/direction.dto';
import { DownloadSaleDTO } from 'src/sales/dto/download-sale.dto';
import { SingleLocationReportStatus } from './helper/singleLocationReportStatus';
import { BusinessStatus } from 'src/business/enums/business-status.enum';
import { GeoCodeService } from './geoCode.service';

@ApiBearerAuth()
@ApiTags('Locations')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/location')
export class LocationDataPortalController {
  constructor(
    public service: LocationService,
    private businessService: BusinessService,
    private manufacturingService: ManufacturingService,
    private productsService: ProductsService,
    private salesReportService: SalesReportService,
    private geoCodeService: GeoCodeService,
  ) {}
  @ApiOperation({ summary: 'Get all locations as MoH' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationSearchRO })
  @ApiQuery({
    name: 'order',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'orderBy',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'numPerPage',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'includes',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'authority',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'location_type',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'reporting_status',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'underage',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'fromdate',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'todate',
    type: String,
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get()
  async getCommonLocations(
    @Query() query: LocationSearchDTO,
  ): Promise<LocationSearchRO> {
    const [locations, count] = await this.service.getCommonLocations(query, true);

    const locationsRO = locations.map((l) => {
      l.reportStatus = new SingleLocationReportStatus().getStatus(l);
      return l.toResponseObject();
    })

    return {
      rows: locationsRO,
      pageNum: query.page,
      totalRows: count,
    };
  }

  @ApiOperation({ summary: 'Download locations reports' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationRO })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post('reportsFile')
  @ApiQuery({
    name: 'getAll',
    description: 'OPTIONAL Boolean to denote if the response should contain all locations. If present, will supercede any values present in the request body.',
    required: false
  })
  @ApiQuery({
    name: 'getNOI',
    description: 'OPTIONAL Boolean to denote if the response should contain only NOIs. Used in conjunction with the getAll flag - will only ever be set to true if getAll is also true.',
    required: false
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'authority',
    type: String,
    required: false,
  })
  async getLocationZip(
    @Res() res: Response,
    @Query('getAll') getAll?: string,
    @Query('getNOI') getNOI?: string,
    @Query('search') search?: string,
    @Query('authority') authority?: string,
    @Query('getSalesReport') getSalesReport?: string,
    @Body() payload?: string[]
  ) {
    let locations: LocationEntity[];
    if (getAll === 'true') {
      locations = await this.service.getLocationWithIds(null, search, authority);
    } else if (getSalesReport === 'true') {
      const years = await this.salesReportService.getYears(payload);
      const salesReportsByYear = await Promise.all(years.map(async ({ year }) => {
        const salesreportByYear = await this.salesReportService.getSalesReportsByYear(year, payload);
        return salesreportByYear;
      }));

      const zip = this.service.packageSalesReport(years, salesReportsByYear as any);
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment'
      });
      zip.pipe(res);
      return;
    } else {
      locations = await this.service.getLocationWithIds(payload);
    }

    // Optimizations!
    const businessIds = locations.reduce((ids, location) => {
      // At this point, products is just ids
      ids.add(location.businessId);
      return ids;
    }, new Set([]));

    const businesses = await this.businessService.getBusinessesWithIds(Array.from(businessIds));
    const businessesDictionary = businesses.reduce((bDict, business) => {
      bDict[business.id] = business;
      return bDict;
    }, {});

    locations.forEach((location) => {
      location.business = businessesDictionary[location.businessId];
    });

   const locationZip = await this.generateLocationZip(locations, getNOI);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment'
    })

    locationZip.pipe(res)
  }

  /**
   * Generating the locationZip by the conditions.
   * @param locations 
   * @param getNOI 
   * @param getSalesReport 
   * @param getSelectedNOI 
   * @returns locationZip ReadableStream
   */
  private async generateLocationZip(
    locations: LocationEntity[],
    getNOI: string | undefined,
  ): Promise<NodeJS.ReadableStream> {
    if (getNOI === 'true') { // get all NOI
      return this.service.packageOnlyNOI(locations);
    }

    const locationIds = locations.map(l => l.id);
    // Get locations with products dictionary
    const locationsWithProducts = await this.productsService.getLocationsWithProducts(
      locationIds,
    );
    const allProducts = Object.values(locationsWithProducts)
      .reduce((products, pArray) => {
        products = [...products, ...pArray];
        return products;
      }, [])
      .reduce((pDict, product) => {
        pDict[product.id] = product;
        return pDict;
      }, {});

    // Get locations with manufactures dictionary
    const locationsWithManufactures = await this.manufacturingService.getLocationsWithManufactures(
      locationIds,
    );

    locations.forEach(location => {
      location.products = locationsWithProducts[location.id];
      location.manufactures = locationsWithManufactures[location.id];
    });
    return this.service.packageAsZip(locations);
  }

  @ApiOperation({ summary: 'gets all the location provided as a csv in the route' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get('/ids/:ids')
  async getLocationWithIds(@Param('ids') ids: string){
    if(!ids) throw NotFoundException;
    const locations = await this.service.getLocationWithIds(ids.split(','));
    return locations.map(l => l.toResponseObject());
  }

  @ApiOperation({ summary: 'Gets all data associated with a single location by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get('/get-location/:id')
  async getExtendedLocation(@Param('id') id: string, @Query('includes') includes: string){
    if(!id) throw NotFoundException;
    const defaultRelations = 'business,business.users,noi,sales,sales.product,sales.productSold,products,manufactures,manufactures.ingredients';
    const allowedRelations = defaultRelations.split(',');
    if(includes){
      includes.split(',').forEach((relation) => {
        if(!allowedRelations.includes(relation)){
          throw new UnprocessableEntityException('Includes invalid relation');
        }
      })
    }
    const location = await this.service.getLocation(id, includes || defaultRelations);
    return location;
  }

  @ApiOperation({ summary: 'Deletes a location by id' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Patch('/delete-location/:id')
  async deleteLocation(@Param('id') id: string){
    if(!id) throw NotFoundException;
    const location = await this.service.getLocationDespiteDeletion(id, 'noi');
    if (!location) throw NotFoundException;
    if (!location.closedAt && !location.deletedAt) throw new ForbiddenException('Cannot delete a location that has not been closed, or deleted by the retailer')
    await this.service.hardDeleteLocation(location);
    return;
  }

  @ApiOperation({ summary: 'gets all the config data for data portal map' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationConfig })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get('/config')
  async config(){
    return new LocationConfig();
  }

  @ApiOperation({ summary: 'gets the direction data between given locations' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post('/direction')
  async getDirection(@Body() payload: DirectionDto){
    if(!payload?.uri) throw UnprocessableEntityException;
    return await this.service.getDirection(payload.uri);
  }

  /**
   * Download Sales Report CSV
   * @param query
   * @param req
   * @returns
   */
  @ApiOperation({ summary: 'Download Sales Report CSV' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get('/download')
   async getSaleReportDownload(
     @Query() query: DownloadSaleDTO,
   ) {
     const { locationId, year } = query;
     return this.service.getDownloadCSV(locationId, year);
   }

  /**
   * Get location Reporting status
   * 
   */
   @ApiOperation({ summary: 'Get Location Reporting Status' })
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthDataGuard)
   @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
   @AllowAnyRole()
   @Get('/report-status/:id')
   async getReportingStatus(@Param('id') id: string){
    if(!id){
      throw new ForbiddenException("location ID is required");
    }
    return await this.service.getLocationReportingStatus(id);
   }

  /**
   * 
   * Close location
  */
  @ApiOperation({ summary: 'Close Single Location' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Patch('/close/:locationId')
  async closeSingleLocation(
    @Param('locationId') id: string,
    @Query('closedTime') closedTime: number
  ): Promise<void> {
    const location = await this.service.getLocation(id);    
    if (!location) throw NotFoundException;
    // close location
    await this.service.closeLocation([id], closedTime);
  }

  /**
   * 
   * Transfer a location to another business
  */
  @ApiOperation({ summary: 'Transfer Location' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Patch('/transfer/:locationId')
  async transferLocation(
    @Param('locationId') id: string,
    @Query('businessId') businessId: string
  ): Promise<void> {
    if(!id)
      throw new ForbiddenException("location ID is required");

    if(!businessId)
      throw new ForbiddenException("New Business ID is required");

    const location = await this.service.getLocation(id);    
    const business = await this.businessService.getBusinessById(businessId); 

    if (!location || !business) throw NotFoundException;

    if (business.status !== BusinessStatus.Active)
      throw new ForbiddenException('Cannot transfer location to a closed business')
    
    await this.service.transferLocation(id, businessId);
  }

  /**
   * 
   * Update fields of a location. (addressLine1 || postall || webpage || phone || email || underage || manufacturing || city || health_authority || longitude || latitude || geo_confidence)
   */
  @ApiOperation({ summary: 'Update fields of a Single Location' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @UseGuards(AuthDataGuard)
  @AllowAnyRole()
  @Patch('/update-fields/:locationId')
  async editSingleLocation(
    @Param('locationId') id: string,
    @Body() payload: any
  ){
    const type = Object.keys(payload)[0]
    const possibleTypes = ['addressLine1','postal','webpage','phone','email','underage','manufacturing', 'city', 'health_authority', 'longitude', 'latitude', 'geo_confidence']
    const typeMappings = {
      health_authority: 'ha',
      geo_confidence: 'geoAddressConfidence'
    };
    if(possibleTypes.includes(type)){
      const location = await this.service.getLocation(id);
      const typeName = typeMappings[type] || type; 
      location[typeName] = type === 'manufacturing'? manufacturingLocationTranslation(payload[type].toLowerCase()) : payload[type];
      await this.service.updateLocation(id, location.toResponseObject() as any);
    }else{
      throw new ForbiddenException("the type is not editable. allowed types: addressLine1 || postal || webpage || phone || email || underage || manufacturing || city || health_authority || longitude || latitude || geo_confidence)");
    }
  }

  /**
   * 
   * Determines the health authority the given coordinates is in
   */
  @ApiOperation({ summary: 'Determines the health authority the given coordinates is in' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @UseGuards(AuthDataGuard)
  @AllowAnyRole()
  @Get('determine-health-authority-on-portal')
  async determineHealthAuthority(
    @Query('lat') lat: number,
    @Query('long') lng: number
  ){
    if(!lat || !lng){
      throw new ForbiddenException("lat & lng are required");
    }
    return this.geoCodeService.determineHealthAuthority(lat, lng);
  }
}
