import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { FindOneParams } from 'src/types/find.params';
import { FollowEntity } from './follow.entity';

@ApiTags('follow')
@Controller('follow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/follow/:id')
  async followUser(@Param('id') id: CreateFollowDto) {
    return this.followService.create(id);
  }

  @Get('/:id')
  async findOne(@Param('id') id: FindOneParams<FollowEntity>) {
    return this.followService.findOne(id);
  }
}
