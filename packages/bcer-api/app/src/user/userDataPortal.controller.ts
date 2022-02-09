import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ROLES } from 'src/auth/constants';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { LocationService } from 'src/location/location.service';
import { NoiService } from 'src/noi/noi.service';
import { UserSearchDTO } from './dto/user-search.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserTypeEnum } from './enums/user-type.enum';
import { PermissionRO, UserRO } from './ro/user.ro';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/user')
export class UserDataPortalController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @ApiOperation({ summary: 'Retrive all users' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UserRO })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @Roles(ROLES.MOH_ADMIN)
  @Get()
  async getUsers(@Query() query: UserSearchDTO): Promise<UserRO[]> {
    const users = await this.userService.getUsersWithBusinessData(query);
    return users.map(u => u.toResponseObject());
  }

  @ApiOperation({ summary: 'Retrive permissions for the current user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @AllowAnyRole()
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @Get('permissions')
  async getPermissions(@Request() req: RequestWithUser): Promise<PermissionRO> {
    return this.authService.getPermissions(req);
  }


  @ApiOperation({ description: 'Update user' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Roles(ROLES.MOH_ADMIN)
  @Patch('update')
  async updateUser(
    @Body() userUpdate: UserUpdateDto,
  ): Promise<string> {
    const user = await this.userService.findById(userUpdate.userId);
    if (!user) {
      throw new NotFoundException(null, 'User with given id not found');
    }
    if (
      userUpdate.newBusinessId &&
      user.businessId === userUpdate.newBusinessId
    ) {
      throw new ConflictException(
        null,
        'New Business can not be same as the current business',
      );
    }
    if (userUpdate.newBusinessId) {
      this.userService.assignBusinessToUser(
        userUpdate.userId,
        userUpdate.newBusinessId,
      );
    }
    if(userUpdate.userStatus){
      // [TODO] update user status. Future task.
    }
    // [TODO] Add a update log to track updates and who made the updates.
    return 'ok';
  }

  @ApiOperation({ summary: 'Creates or retrieves a user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserRO })
  @HttpCode(HttpStatus.OK)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post('profile')
  async profile(@Request() req: RequestWithUser): Promise<UserRO> {
    const start = process.hrtime();
    const { bceidGuid, bceidUser, email, firstName, lastName, roles } = req.user;
    let validatedUser = await this.userService.findByBCeID(bceidGuid);
    let type = roles?.includes(ROLES.HA_ADMIN) ? UserTypeEnum.HEALTH_AUTHORITY : UserTypeEnum.MINISTRY;
    if (!validatedUser) {
      const user = await this.userService.create({
        bceid: bceidGuid,
        bceidUser, 
        email,
        firstName,
        lastName,
        type,
      });
      validatedUser = user;
    } else if (!validatedUser.bceidUser) {
      await this.userService.update({
        id: validatedUser.id,
        bceidUser,
      });
    }
    return validatedUser.toResponseObject();
  }
}
