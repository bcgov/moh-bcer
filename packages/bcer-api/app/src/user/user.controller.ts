import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/auth.module';
import { UserRO, ProfileRO, StatusRO } from 'src/user/ro/user.ro';
import { UserService } from 'src/user/user.service';
import { BusinessService } from 'src/business/business.service';
import { LocationService } from 'src/location/location.service';

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
    const business = businessId ? await this.businessService.getBusinessById(businessId, 'locations') : null;
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
    const { businessId } = req.ctx;
    if (!businessId) {
      return {
        myBusinessComplete: false,
        noiComplete: false,
        productReportComplete: false,
        manufacturingReportComplete: false,
      }
    }
    const business = await this.businessService.getBusinessById(businessId);
    const locations = await this.locationService.getBusinessLocations(businessId, 'noi,products,manufactures');

    let statusObject = {
      myBusinessComplete: Boolean(business.legalName && business.email),
      noiComplete: locations.length > 0 ? locations.every(l => l.noi) : false,
      productReportComplete: locations.length > 0 ? locations.every(l => l.products.length) : false,
      manufacturingReportComplete: locations.length > 0 ? locations.filter(l => l.manufacturing).every(l => l.manufactures.length) : false,
    };

    return statusObject;
  }
}
