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
  Post,
  Query,
  Param,
  ForbiddenException,
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
import { LocationService } from 'src/location/location.service';

import { Unprotected } from 'src/auth/auth.module';
import { QuerySaleDTO } from './dto/query-sale.dto';
import { SubmissionService } from 'src/submission/submission.service';
import { ProductSoldService } from 'src/product-sold/product-sold.service';
import { DownloadSaleDTO } from './dto/download-sale.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@UseGuards(AuthGuard, RoleGuard)
@Controller('sales')
export class SalesReportController {
  constructor(
    public service: SalesReportService,
    private locationService: LocationService,
    private submissionService: SubmissionService,
    private productSoldService: ProductSoldService,
  ) {}

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
    return sales.map((salesReport: SalesReportEntity) =>
      salesReport.toResponseObject(),
    );
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
    return sales.map((salesReport: SalesReportEntity) =>
      salesReport.toResponseObject(),
    );
  }

  @ApiOperation({ summary: 'Create Sales Reports' })
  @ApiResponse({ status: HttpStatus.CREATED, type: [SalesReportRO] })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  // @Unprotected()
  @UseGuards(BusinessGuard)
  @Post('/:submissionId')
  async createProductSoldSalesReports(
    @Param('submissionId') submissionId: string,
    @Request() req: RequestWithUser,
  ): Promise<any> {
    const submission = await this.submissionService.getOne(submissionId);

    if (submission.businessId !== req.ctx.businessId) {
      throw new ForbiddenException(
        'This user does not have access to this submission',
      );
    }

    const saleReportsData = submission.data.saleReports;
    const locationId = submission.data.locationId;
    const year = String(+submission.data.year - 1);
    const businessId = submission.businessId;

    // replace existing sales reports, deleting the existing one.
    if (submission.data.isSubmitted) {
      await this.service.remove(locationId, year);
    }

    const productSolds = await this.productSoldService.createProductSold(
      saleReportsData,
      businessId,
      locationId,
    );
    const saleReports = await this.service.createSalesReportsBySubmission(
      locationId,
      year,
      saleReportsData,
      productSolds,
    );
    return saleReports;
  }

  @UseGuards(BusinessGuard)
  @Roles('user')
  @Get('/locations')
  async getSaleReportLocations(
    @Query() query: QuerySaleDTO,
    @Request() req: RequestWithUser,
  ) {
    const { businessId } = req.ctx;
    const locations = await this.locationService.getLocationsSalesReportWithCurrentYear(
      businessId,
      query,
    );
    return locations;
  }

  @UseGuards(BusinessGuard)
  @Roles('user')
  @Get('/download')
  async getSaleReportDownload(
    @Query() query: DownloadSaleDTO,
    @Request() req: RequestWithUser,
  ) {
    const { locationId, year } = query;
    return this.service.getDownloadCSV(locationId, year);
  }
}
