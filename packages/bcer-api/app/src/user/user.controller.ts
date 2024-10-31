import { Controller, Get, HttpCode, HttpStatus, Logger, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { UserRO, ProfileRO, StatusRO } from 'src/user/ro/user.ro';
import { UserService } from 'src/user/user.service';
import { BusinessService } from 'src/business/business.service';
import { LocationService } from 'src/location/location.service';
import { getDurationInMilliseconds } from '../utils/util';
import { ROLES } from 'src/auth/constants';
import { LocationStatus } from 'src/location/enums/location-status.enum';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly locationService: LocationService,
  ) {}

  @Get()
  findAll(): Promise<UserRO[]> {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Creates or retrieves a user' })
  @ApiResponse({ status: HttpStatus.OK, type: ProfileRO })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Post('profile')
  async profile(@Request() req: RequestWithUser): Promise<ProfileRO> {
    const start = process.hrtime();
    const { bceidGuid, bceidUser, email, firstName, lastName, businessId } = req.ctx;
    let validatedUser = await this.userService.findByBCeID(bceidGuid);
    if (!validatedUser) {
      const user = await this.userService.create({
        bceid: bceidGuid,
        bceidUser, 
        email,
        firstName,
        lastName,
      });
      validatedUser = user;
    } else if (!validatedUser.bceidUser) {
      await this.userService.update({
        id: validatedUser.id,
        bceidUser,
      });
    }
    const userData: UserRO = validatedUser.toResponseObject();
    const business = businessId ? await this.businessService.getBusinessById(businessId, 'locations,noi') : null;
    Logger.log(`Time to process profile request after middleware ${getDurationInMilliseconds(start)} ms`);
    return {
      userData,
      business: business?.toResponseObject(),
    };
  }

  @ApiOperation({ summary: 'Retrieve a user status object' })
  @ApiResponse({ status: HttpStatus.OK, type: StatusRO })
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @Get('status')
  async status(@Request() req: RequestWithUser): Promise<StatusRO> {
    const start = process.hrtime();
    const { businessId } = req.ctx;
    if (!businessId) {
      Logger.log(`Time to process status request after middleware ${getDurationInMilliseconds(start)} ms`);
      return {
        myBusinessComplete: false,
        noiComplete: false,
        productReportComplete: false,
        manufacturingReportComplete: false,
      }
    }
    const business = await this.businessService.getBusinessById(businessId);
    const locations = await this.locationService.getBusinessLocations(businessId, 'noi', 'products,manufactures');
    let statusObject = {
      myBusinessComplete: Boolean(business.legalName && business.email),
      noiComplete: locations.filter(l => l.status !== 'closed').every(l => l.noi !== null && l.noi !== undefined),
      productReportComplete: locations.filter(l => l.status !== 'closed').every(l => l.products?.length > 0 || l.productsCount > 0),
      manufacturingReportComplete: locations.filter(l => l.status !== 'closed').every(l => {
        if (l.manufacturing) {
          return l.manufactures?.length > 0 || l.manufacturesCount > 0;
        }
        return true;
      }),
    };

    Logger.log(`Time to process status request after middleware ${getDurationInMilliseconds(start)} ms`);
    return statusObject;
  }

  @ApiOperation({ summary: 'Retrive config for users' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @Roles(ROLES.USER)
  @Get('config')
  async getPermissions() {
    return this.userService.getConfig();
  }
}
