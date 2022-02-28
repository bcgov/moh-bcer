import { Controller, Get, HttpStatus, NotFoundException, Param, Query, UnprocessableEntityException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AllowAnyRole, RoleGuard, Roles } from "src/auth/auth.module";
import { ROLES } from "src/auth/constants";
import { AuthDataGuard } from "src/auth/guards/authData.guard";
import { LocationService } from "src/location/location.service";
import { PaginatedProductQuery } from "./dto/paginatedProductQuery.dto";
import { ProductsService } from "./products.service";

@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/products')
export class ProductsDataPortalController {
  constructor(private productsService: ProductsService, private locationService: LocationService){}

  @ApiOperation({ summary: 'Get paginated products for a location' })
  @ApiResponse({ status: HttpStatus.OK })
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
  @Roles(ROLES.MOH_ADMIN, ROLES.HA_ADMIN)
  @AllowAnyRole()
  @Get('/location/:locationId')
  async getProductsForALocation(
    @Query() query: PaginatedProductQuery,
    @Param('locationId') locationId: string,
  ){
    if(!locationId){
      throw new UnprocessableEntityException();
    }
    const location = await this.locationService.getLocation(locationId, 'business');
    if(!location){
      throw new NotFoundException();
    }

    return await this.productsService.getPaginatedProductsForLocation(locationId, query);
  }
}