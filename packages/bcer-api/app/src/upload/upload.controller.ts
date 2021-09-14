import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiProperty,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import csv from 'csvtojson';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles, Unprotected } from 'src/auth/auth.module';

import { BusinessService } from 'src/business/business.service';
import { SubmissionService } from 'src/submission/submission.service';
import { UploadService } from 'src/upload/upload.service';
import { ProductsFileUploadRO, LocationsFileUploadRO } from 'src/upload/ro/file-upload.ro';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  submission: any;
}

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(
    public uploadService: UploadService,
    public submissionService: SubmissionService,
    public businessService: BusinessService,
  ){}

  @ApiOperation({ summary: 'Upload Business Locations from a CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Post('location/:submissionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'CSV',
    type: FileUploadDto,
  })
  async submit(
    @UploadedFile() file: File & { buffer: Buffer },
    @Param('submissionId') submissionId?: string
  ): Promise<LocationsFileUploadRO> {
    let headers = [];
    const data = await csv({
      ignoreEmpty: true,
    }).on('header', (header: Array<string>) => {
      headers = header
    }).fromString(file.buffer.toString());
    console.dir(data);
    await this.submissionService.updateSubmission({
      data: { locations: data },
    }, submissionId);
    return {
      headers,
      submissionId,
      locations: data.slice(0, 5),
    };
  }

  @ApiOperation({ summary: 'Upload Products from a CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Post('submission/:submissionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'CSV',
    type: FileUploadDto,
  })
  async uploadProducts(
    @UploadedFile() file: File & { buffer: Buffer },
    @Param('submissionId') submissionId?: string
  ): Promise<ProductsFileUploadRO> {
    let headers = [];
    const data = await csv({
      ignoreEmpty: true,
    }).on('header', (header: Array<string>) => {
      headers = header
    }).fromString(file.buffer.toString());
    await this.submissionService.updateSubmission({
      data: { products: data }
    }, submissionId);
    return {
      headers,
      submissionId,
      products: data.slice(0, 5),
    };
  }

  @ApiOperation({ summary: 'Upload Sales Report from a CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Post('sales-report/:submissionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'CSV',
    type: FileUploadDto,
  })
  async saleReportSubmit(
    @UploadedFile() file: File & { buffer: Buffer },
    @Param('submissionId') submissionId?: string
  ): Promise<any> {
    let headers = [];
    const data = await csv({
      ignoreEmpty: true,
    }).on('header', (header: Array<string>) => {
      headers = header
    }).fromString(file.buffer.toString());
    console.dir(data);
    await this.submissionService.updateSubmission({
      data: { saleReports: data },
    }, submissionId);
    return {
      headers,
      submissionId,
      saleReports: data,
    };
  }
}
