import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthDataGuard } from 'src/auth/guards/authData.guard';
import { ROLES } from 'src/auth/constants';
import { AllowAnyRole, RoleGuard, Roles } from 'src/auth/auth.module';
import { FavouriteDto } from './dto/favourite.dto';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { UserService } from 'src/user/user.service';

@ApiBearerAuth()
@ApiTags('Favourite')
@UseGuards(AuthDataGuard, RoleGuard)
@Controller('data/favourite')
export class FavouriteDataPortalController {
  constructor(
    private favouriteService: FavouriteService,
    private userService: UserService,
  ) {}


  @ApiOperation({ summary: 'Save a favourite search' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Post()
  async create(@Body() payload: FavouriteDto, @Request() req: RequestWithUser) {
    const user = await this.userService.findByBCeID(req.user.bceidGuid);
    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }
    
    await this.favouriteService.create(user, payload);
    return 'ok';
  }

  @ApiOperation({ summary: 'Get user favourite search' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Get()
  async findByUser(@Request() req: RequestWithUser) {
    const user = await this.userService.findByBCeID(req.user.bceidGuid);
    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }
    
    return this.favouriteService.findByUser(user);
  }

  @ApiOperation({ summary: 'Delete favourite' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthDataGuard)
  @Roles(ROLES.HA_ADMIN, ROLES.MOH_ADMIN)
  @AllowAnyRole()
  @Delete('/:id')
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    const user = await this.userService.findByBCeID(req.user.bceidGuid);
    if (!user) {
      throw new ForbiddenException('User was not found in database');
    }

    const favourite = await this.favouriteService.findOne(id)
    if (!favourite) {
      throw new NotFoundException('Favourite not found');
    }

    if (favourite.user.id !== user.id) {
      throw new ForbiddenException('User does not have permission to perform this action');
    }

    return await this.favouriteService.remove(id);
  }
}