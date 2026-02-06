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
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
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
    private readonly postService: PostService,
    private readonly cls: ClsService,
  ) {}

  @Get('my-posts')
  async getMyPosts(@Query() query: UserPostDto) {
    const myUser = this.cls.get<UserEntity>('user');
    console.log(myUser);
    return this.postService.userPosts(myUser.id, query);
  }

  @Get('user/:userId')
  @UseGuards(ProfileGuard)
  async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: UserPostDto,
  ) {
    return this.postService.userPosts(userId, query);
  }

  @Post('create-post')
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @Post('toggle-like/:postId')
  async toggleLike(@Param('postId') postId: string) {
    return this.postService.toggleLike(postId);
  }
}
