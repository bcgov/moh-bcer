import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import {
  ApiParam,
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
import { LocationService } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { LocationSearchRO } from 'src/location/ro/locationSearch.ro';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { ProductsService } from 'src/products/products.service';
import { SalesReportService } from 'src/sales/sales.service';
import { Roles } from 'nest-keycloak-connect/decorators/roles.decorator';
import { ROLES } from 'src/auth/constants';
import { AllowAnyRole } from 'nest-keycloak-connect';

@ApiBearerAuth()
@ApiTags('Locations')
@UseGuards(AuthDataGuard)
@Roles(ROLES.MOH_ADMIN)
@Controller('data/location')
export class LocationDataPortalController {
  constructor(
    public service: LocationService,
    private businessService: BusinessService,
    private manufacturingService: ManufacturingService,
    private productsService: ProductsService,
    private salesReportService: SalesReportService,
  ) { }
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
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get()
  async getCommonLocations(
    @Query() query: LocationSearchDTO,
  ): Promise<LocationSearchRO> {
    const [locations, count] = await this.service.getCommonLocations(query);
    return {
      rows: locations.map((location) => location.toResponseObject()),
      pageNum: query.page,
      totalRows: count,
    };
  }

  @ApiOperation({ summary: 'Download locations reports' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
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
    @Body() payload?: Array<string>
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
}
