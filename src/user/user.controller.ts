import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from './user.entity';
import { USER_PROFILE_SELECT } from './user-select';
import { UpdateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private cls: ClsService,
  ) {}

  @Get('/profile')
  async myProfile() {
    let myUser = await this.cls.get<UserEntity>('user');
    return this.userService.findOne({
      where: { id: myUser.id },
      select: USER_PROFILE_SELECT,
    });
  }

  @Get('/profile/:id')
  async userProfile(@Param('id') id: string) {
    return this.userService.findOne({
      where: { id },
      select: USER_PROFILE_SELECT,
    });
  }

  @Post('/profile/update')
  async updateProfile(@Body() body: UpdateUserDto) {
    return this.userService.update(body);
  }
}
