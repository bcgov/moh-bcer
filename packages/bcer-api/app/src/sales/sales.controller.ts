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

import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { SalesReportRO } from 'src/sales/ro/sales.ro';
import { SalesReportService } from 'src/sales/sales.service';
import { SalesReportDTO } from './dto/sales.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@UseGuards(AuthGuard, RoleGuard)
@Controller('sales')
export class SalesReportController {
  constructor(
    public service: SalesReportService,
  ){}

  @ApiOperation({ summary: 'Create Sales Reports' })
  @ApiResponse({ status: HttpStatus.CREATED, type: [SalesReportRO] })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch()
  async createSalesReports(
    @Body() payload: SalesReportDTO,
    @Request() req: RequestWithUser,
  ): Promise<SalesReportRO[]> {
    const sales = await this.service.createSalesReports(payload);
    return sales.map((salesReport: SalesReportEntity) => salesReport.toResponseObject());
  }

  @ApiOperation({ summary: 'Get Sales Reports' })
  @ApiResponse({ status: HttpStatus.OK, type: [SalesReportRO] })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get()
  async getSalesReports(
    @Request() req: RequestWithUser,
  ): Promise<SalesReportRO[]> {
    const sales = await this.service.getSalesReports();
    return sales.map((salesReport: SalesReportEntity) => salesReport.toResponseObject());
  }
}
