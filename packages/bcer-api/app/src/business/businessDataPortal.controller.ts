import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/auth.module';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { LocationService } from 'src/location/location.service';
import { ManufacturingService } from 'src/manufacturing/manufacturing.service';
import { NoiService } from 'src/noi/noi.service';
import { ProductSoldService } from 'src/product-sold/product-sold.service';
import { ProductsService } from 'src/products/products.service';
import { BusinessService } from './business.service';
import { BusinessMergeDTO } from './dto/business-merge.dto';
import { BusinessRO } from './ro/business.ro';

@ApiBearerAuth()
@ApiTags('Business')
@UseGuards(AuthDataGuard)
@Roles(ROLES.MOH_ADMIN)
@Controller('data/business')
export class BusinessDataPortalController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly noiService: NoiService,
    private readonly locationService: LocationService,
    private readonly productsService: ProductsService,
    private readonly manufacturingService: ManufacturingService,
    private readonly productSoldService: ProductSoldService,
  ) {}
  @ApiOperation({ summary: 'Retrieve all businesses' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: BusinessRO })
  @UseGuards(AuthDataGuard)
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
  @UseGuards(AuthDataGuard)
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
}
