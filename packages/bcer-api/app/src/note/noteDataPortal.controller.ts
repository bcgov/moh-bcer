import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { BusinessService } from 'src/business/business.service';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationService } from 'src/location/location.service';
import { UserService } from 'src/user/user.service';
import { NoteDTO } from './dto/note.dto';
import { NoteService } from './note.service';

@ApiBearerAuth()
@ApiTags('Locations')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/note')
export class NoteDataPortalController {
  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private locationService: LocationService,
    private businessService: BusinessService,
  ) {}

  @ApiOperation({ summary: 'Create a new Note' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post()
  async createNote(@Body() payload: NoteDTO, @Request() req: RequestWithUser) {
    const user = await this.userService.findByBCeID(req.user.bceidGuid);
    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }
    let business: BusinessEntity;
    let location: LocationEntity;
    if (payload.businessId) {
      business = await this.businessService.getBusinessById(payload.businessId);
      if (!business) {
        throw new NotFoundException(
          `Business with id: ${payload.businessId} not found!`,
        );
      }
    }
    if (payload.locationId) {
      location = await this.locationService.getLocation(payload.locationId);
      if (!location) {
        throw new NotFoundException(
          `Location with id: ${payload.locationId} not found!`,
        );
      }
    }
    await this.noteService.create(payload.content, user, business, location);
    return 'ok';
  }

  @ApiOperation({ summary: 'Get notes by location or business id' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get('/get/:targetId')
  async getNotesByBusinessOrLocationId(@Param('targetId') targetId: string) {
    if (!targetId) {
      throw new UnprocessableEntityException(
        'BusinessId or locationId is needed to process the request',
      );
    }
    const notes = await this.noteService.getNoteForLocationOrBusiness(targetId);
    return notes.map((n) => n.toResponseObject());
  }
}
