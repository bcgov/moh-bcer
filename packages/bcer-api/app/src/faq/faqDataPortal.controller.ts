import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { FaqDTO } from './dto/faq.dto';
import { FaqService } from './faq.service';
import { FaqRO } from './ro/faq.ro';

@ApiBearerAuth()
@ApiTags('Faq')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/faq')
export class FaqDataPortalController {
  constructor(private faqService: FaqService) {}


  @ApiOperation({ summary: 'Create or Update FAQ List' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Patch()
  async storeFaqList(@Body() payload: FaqDTO) {
    await this.faqService.create(payload);
    return 'ok';
  }

  @ApiOperation({ summary: 'Get FAQ List' })
  @ApiResponse({ status: HttpStatus.OK, type: FaqRO })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get()
  async getFaqList() {
    const faqList = await this.faqService.getFaqList();

    return faqList;
  }
}
