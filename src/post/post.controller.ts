import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/user/user.entity';
import { UserPostDto } from './dto/user.post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ProfileGuard } from 'src/user/guards/profile.guard';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private postService: PostService,
    private cls: ClsService,
  ) {}

  @Get('my-posts')
  async getMyPosts(@Query() query: UserPostDto) {
    const myUser = await this.cls.get<UserEntity>('user');
    return this.postService.userPosts(myUser.id, query);
  }

  @Get('user/:userId')
  @UseGuards(ProfileGuard)
  async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: UserPostDto,
  ) {
    return await this.postService.userPosts(userId, query);
  }

  @Post('create-post')
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @Post('user/:userId/toggle-like/:postId')
  async toggleLike(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.toggleLike(userId, postId);
  }
}
