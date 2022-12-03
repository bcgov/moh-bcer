import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RoleGuard, Roles } from 'src/auth/auth.module';
import { FaqService } from './faq.service';

@ApiBearerAuth()
@ApiTags('Faq')
@UseGuards(AuthGuard, RoleGuard)
@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @ApiOperation({ summary: 'Get FAQ List' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Get()
  async getFaqList() {
    const faqList = await this.faqService.getFaqList();

    return faqList;
  }
}
