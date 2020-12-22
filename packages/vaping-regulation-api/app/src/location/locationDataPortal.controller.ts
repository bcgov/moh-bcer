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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { BusinessService } from 'src/business/business.service';
import { LocationSearchDTO } from 'src/location/dto/locationSearch.dto';
import { LocationService } from 'src/location/location.service';
import { LocationRO } from 'src/location/ro/location.ro';
import { LocationSearchRO } from 'src/location/ro/locationSearch.ro';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { ProductsService } from 'src/products/products.service';
import { SalesReportService } from 'src/sales/sales.service';

@ApiBearerAuth()
@ApiTags('Locations')
@UseGuards(AuthDataGuard)
@Controller('data/location')
export class LocationDataPortalController {
  constructor(
    public service: LocationService,
    private businessService: BusinessService,
    private manufacturingService: ManufacturingService,
    private productsService: ProductsService,
    private salesReportService: SalesReportService,
  ){}
  @ApiOperation({ summary: 'Get all locations as MoH' })
  @ApiResponse({ status: HttpStatus.OK, type: LocationSearchRO })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
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
  @Post('reportsFile')
  @ApiParam({
    name: 'getAll',
    description: 'OPTIONAL Boolean to denote if the response should contain all locations. If present, will supercede any values present in the request body.',
    required: false
  })
  @ApiParam({
    name: 'getNOI',
    description: 'OPTIONAL Boolean to denote if the response should contain only NOIs. Used in conjunction with the getAll flag - will only ever be set to true if getAll is also true.',
    required: false
  })
  async getLocationZip(
    @Res() res: Response,
    @Query('getAll') getAll?: boolean,
    @Query('getNOI') getNOI?: boolean,
    @Body() payload?: Array<string>
  ) {
    let locations;
    if(getAll) {
      locations = await this.service.getLocationWithIds();
    } else {
      locations = await this.service.getLocationWithIds(payload);
    }

    let locationZip;

    // Optimizations!
    const { productIds, manufactureIds, businessIds, salesIds } = locations.reduce((ids, location) => {
      // At this point, products is just ids
      ids.productIds.push(...location.products);
      ids.manufactureIds.push(...location.manufactures);
      ids.businessIds.push(location.businessId);
      ids.salesIds.push(...location.sales);
      return ids;
    }, { productIds: [], manufactureIds: [], businessIds: [], salesIds: [] });
    
    const businesses = await this.businessService.getBusinessesWithIds(Array.from(new Set(businessIds)));
    const businessesDictionary = businesses.reduce((bDict, business) => {
      bDict[business.id] = business;
      return bDict;
    }, {});

    locations.forEach((location) => {
      const bId = location.business as any;
      location.business = businessesDictionary[bId];
    });

    if (!getNOI) {
      const products = await this.productsService.getProductsWithIds(Array.from(new Set(productIds)));
      const productDictionary = products.reduce((pDict, product) => {
        pDict[product.id] = product;
        return pDict;
      }, {});

      const manufactures = await this.manufacturingService.getManufacturesWithIds(Array.from(new Set(manufactureIds)));
      const manufacturesDictionary = manufactures.reduce((mDict, manufacture) => {
        mDict[manufacture.id] = manufacture;
        return mDict;
      }, {});

      const sales = await this.salesReportService.getSalesReportsWithIds(Array.from(new Set(salesIds)));
      const salesDictionary = sales.reduce((sDict, sale) => {
        sDict[sale.id] = sale;
        return sDict;
      }, {});

      locations.forEach((location) => {
        const pIds = location.products as any;
        const mIds = location.manufactures as any;
        const sIds = location.sales as any;
        location.products = pIds.map((pId) => productDictionary[pId]);
        location.manufactures = mIds.map((mId) => manufacturesDictionary[mId]);
        location.sales = sIds.map((sId) => salesDictionary[sId]);
      });
      locationZip = await this.service.packageAsZip(locations);
    } else {
      locationZip = await this.service.packageOnlyNOI(locations);
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment'
    })

    locationZip.pipe(res)
  }
}
