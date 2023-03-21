import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { ROLES } from 'src/auth/constants';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';


@ApiBearerAuth()
@ApiTags('Reports')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/report')
export class ReportDataPortalController {
  constructor(
    private readonly reportService: ReportService,
    private readonly userService: UserService) 
  {}
  
  @ApiOperation({ summary: 'Generate reports' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post('generate')
  async generateReport(@Body() payload: any, @Request() req: RequestWithUser): Promise<string> {
    //validate input
    
    const user = await this.userService.findByBCeID(req.user.bceidGuid);

    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }
    
    this.reportService.generateReport(user, payload);
    
    return 'ok';
  }

  @ApiOperation({ summary: 'Get 5 reports' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get()
  async getReports(): Promise<any> {
      return await this.reportService.getReports(5);
  }

  @ApiOperation({ summary: 'Download report' })
  @ApiResponse({ status: HttpStatus.OK})
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post("/download")
  async downloadReport (
    @Res() res: Response,
    @Body() payload: any)
  {
      if (!payload.id) throw NotFoundException;

      const report = await this.reportService.getReport(payload.id);

      if (!report) throw NotFoundException;

      const reportFileBuffer = await this.reportService.downloadReport(report);
   
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment'
      })

      return res.send(reportFileBuffer);
  }
}