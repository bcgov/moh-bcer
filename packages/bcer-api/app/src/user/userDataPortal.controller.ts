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
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { LocationService } from 'src/location/location.service';
import { NoiService } from 'src/noi/noi.service';
import { UserSearchDTO } from './dto/user-search.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserRO } from './ro/user.ro';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthDataGuard)
@Controller('data/user')
export class UserDataPortalController {
  constructor(
    private readonly userService: UserService,
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
  @UseGuards(AuthDataGuard)
  @Get()
  async getUsers(@Query() query: UserSearchDTO): Promise<UserRO[]> {
    const users = await this.userService.getUsersWithBusinessData(query);
    return users.map(u => u.toResponseObject());
  }

  @ApiOperation({ description: 'Update user' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @ApiResponse({ status: HttpStatus.OK, type: String })
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
}
