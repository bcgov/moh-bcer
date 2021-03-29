import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { LocationService } from 'src/location/location.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';

import { ProductsService } from 'src/products/products.service';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsDTO } from 'src/products/dto/products.dto';
import { ProductRO } from 'src/products/ro/product.ro';
import { ProductsLocationsRO } from './ro/products-locations.ro';
import { ProductUploadRO } from './ro/product-upload.ro';
import { LocationEntity } from 'src/location/entities/location.entity';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(AuthGuard, RoleGuard)
@Controller('products')
export class ProductsController {
  constructor(
    public service: ProductsService,
    private locationService: LocationService,
  ){}

  @ApiOperation({ summary: 'Create products' })
  @ApiResponse({ status: HttpStatus.CREATED, type: [ProductRO] })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch()
  async createProducts(
    @Body() payload: ProductsDTO,
    @Request() req: RequestWithUser,
    ): Promise<void> {
    const products = await this.service.createProducts(payload, req.ctx.businessId);
    return;
  }

  @ApiOperation({ summary: 'Get Products' })
  @ApiResponse({ status: HttpStatus.OK, type: ProductsLocationsRO })
  @ApiQuery({
    name: 'submissionId',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getProducts(
    @Request() req: RequestWithUser,
    @Query('submissionId') submissionId?: string,
  ): Promise<ProductsLocationsRO> {
    const products = await this.service.getProducts(req.ctx.businessId, submissionId);
    const productIds = products.map((product: ProductEntity) => product.id);
    const locationIds = await this.service.getLocationIdsForProducts(productIds);
    const locations = await this.locationService.getLocationWithIds(locationIds);
    return {
      locations: locations.map((location: LocationEntity) => location.toResponseObject()),
      products: products.map((product: ProductEntity) => product.toResponseObject()),
    }
  }

  @ApiOperation({ summary: 'Clear Products' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Delete()
  async clearProducts(): Promise<void> {
    await this.service.clearProducts();
    return;
  }

  @ApiOperation({ summary: 'Get product submissions' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Get('submissions')
  async getProductSubmissions(
    @Request() req: RequestWithUser,
  ): Promise<ProductUploadRO[]> {
    const submissions = await this.service.getProductSubmissions(req.ctx.businessId);
    return submissions;
  }

  @ApiOperation({ summary: 'Delete products of a submission' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiParam({
    name: 'productUploadId',
    description: 'Product Upload uuid',
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Delete('submission/:productUploadId')
  async deleteProductsWithUploadId(
    @Request() req: RequestWithUser,
    @Param('productUploadId') productUploadId: string,
  ): Promise<void> {
    await this.service.deleteProductSubmissions(req.ctx.businessId, productUploadId);
    return;
  }
}
