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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';

import { ProductsService } from 'src/products/products.service';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsDTO } from 'src/products/dto/products.dto';
import { ProductRO } from 'src/products/ro/product.ro';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(AuthGuard, RoleGuard)
@Controller('products')
export class ProductsController {
  constructor(
    public service: ProductsService,
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
  @ApiResponse({ status: HttpStatus.OK, type: [ProductRO] })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getProducts(
    @Request() req: RequestWithUser,
  ): Promise<ProductRO[]> {
    const product = await this.service.getProducts(req.ctx.businessId)
    return product.map((product: ProductEntity) => product.toResponseObject())
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
}
