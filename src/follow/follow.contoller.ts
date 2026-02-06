import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FollowServices } from './follow.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('follow')
@Controller('follow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowServices) {}

  @Get('/follower-list')
  @ApiOperation({ summary: 'Get list of waiting users the current user' })
  async followerList() {
    return this.followService.followerList();
  }

  @Post('/follow/:userId')
  @ApiOperation({ summary: 'Send follow request to a user' })
  async followUser(@Param('userId') userId: string) {
    return this.followService.create({ userId });
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get followers of a specific user' })
  async findUser() {
    return this.followService.findFollowersOfUser();
  }

  @Post('/accept/:userId')
  @ApiOperation({ summary: 'Accept a follow request from a user' })
  async acceptRequest(@Param('userId') userId: string) {
    return this.followService.accept(userId);
  }

  @Post('/reject/:userId')
  @ApiOperation({ summary: 'Reject a follow request from a user' })
  async rejectFollow(@Param('userId') userId: string) {
    return this.followService.reject(userId);
  }

  @Delete('/remove/:userId')
  @ApiOperation({ summary: 'Remove a follower from the current user' })
  async removeFollow(@Param('userId') userId: string) {
    return this.followService.removeFollow(userId);
  }

  @Delete('/unfollow/:userId')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollow(@Param('userId') userId: string) {
    return this.followService.unfollow(userId);
  }
}
