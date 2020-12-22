import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BusinessGuard } from 'src/user/guards/business.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { Roles, Unprotected } from 'src/auth/auth.module';
import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { SubmissionService } from 'src/submission/submission.service';
import { SubmissionDTO, UpdateSubmissionDTO } from  'src/submission/dto/submission.dto';
import { SubmissionRO } from 'src/submission/ro/submission.ro';
import { UserService } from 'src/user/user.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
  constructor(
    public submissionService: SubmissionService,
    public userService: UserService,
  ){}

  // TODO use submission Id always in @PARAM

  @ApiOperation({ summary: 'Start a submission' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SubmissionRO })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() payload: SubmissionDTO,
  ): Promise<SubmissionRO> {
    if (req.ctx.businessId) payload.businessId = req.ctx.businessId;
    else payload.businessId = req?.ctx?.bceid;
    const submission = await this.submissionService.createSubmission(payload);
    if (!req.ctx.businessId) {
      await this.userService.update({
        id: req.ctx.userId,
        business: submission.business,
      });
    }
    return submission.toResponseObject();
  }


  @ApiOperation({ summary: 'Get submission' })
  @ApiResponse({ status: HttpStatus.OK, type: SubmissionRO })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Get('/:submissionId')
  async getSubmission(
    @Request() req: RequestWithUser,
    @Param('submissionId') id: string,
  ): Promise<SubmissionRO> {
    const submission = await this.submissionService.getOne(id);
    if (submission.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this submission');
    }
    return submission.toResponseObject();
  }

  @ApiOperation({ summary: 'Continue a submission' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SubmissionRO })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch('/:submissionId')
  async update(
    @Request() req: RequestWithUser,
    @Body() payload: UpdateSubmissionDTO,
    @Param('submissionId') submissionId: string,
  ): Promise<SubmissionRO> {
    const submission = await this.submissionService.getOne(submissionId);
    if (submission.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this submission');
    }
    const savedSubmission = await this.submissionService.updateSubmission(payload, submissionId);
    return savedSubmission.toResponseObject();
  }

  @ApiOperation({ summary: 'Map a submission' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SubmissionRO })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Patch('/:submissionId/map')
  async mapSubmission(
    @Request() req: RequestWithUser,
    @Body() payload: UpdateSubmissionDTO,
    @Param('submissionId') submissionId: string,
  ): Promise<SubmissionRO> {
    const submission = await this.submissionService.getOne(submissionId);
    if (submission.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this submission');
    }
    const mappedSubmission = await this.submissionService.mapSubmission(submissionId, payload);
    return mappedSubmission.toResponseObject();
  }

  @ApiOperation({ summary: 'Save a submission' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SubmissionRO })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  @UseGuards(BusinessGuard)
  @Post('/:submissionId/save')
  async submit(
    @Request() req: RequestWithUser,
    @Param('submissionId') submissionId: string,
  ): Promise<SubmissionRO> {
    const submission = await this.submissionService.getOne(submissionId);
    if (submission.businessId !== req.ctx.businessId) {
      throw new ForbiddenException('This user does not have access to this submission');
    }
    const savedSubmission = await this.submissionService.saveSubmission(submissionId);
    return savedSubmission.toResponseObject();
  }
}
