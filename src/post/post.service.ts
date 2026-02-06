import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { CreatePostDto } from './dto/create-post.dto';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/user/user.entity';
import { UserPostDto } from './dto/user.post.dto';
import { FollowEntity, FollowStatus } from 'src/follow/follow.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    @InjectRepository(FollowEntity)
    private followRepo: Repository<FollowEntity>,
    private cls: ClsService,
  ) {}

  async find(params: FindParams<PostEntity>) {
    const { where, select, relations, order, limit = 10, page = 1 } = params;

    return await this.postRepo.find({
      where,
      select,
      relations,
      order,
      take: limit,
      skip: page * limit,
    });
  }

  async findOne(params: FindOneParams<PostEntity>) {
    const { where, select, relations } = params;

    return await this.postRepo.findOne({
      where,
      select,
      relations,
    });
  }

  async createPost(params: CreatePostDto) {
    const myUser = await this.cls.get<UserEntity>('user');
    let images = params.images.map((id) => {
      return { id };
    });

    let post = this.postRepo.create({ ...params, images, user: { id: myUser.id } });

    await post.save();

    return { status: true, post };
  }

  async toggleLike(postId: string) {
    const myUser = this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException('User not found');

    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: {
        user: true,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    if (post.user.isPrivate && post.user.id !== myUser.id) {
      const isFollowing = await this.followRepo.exist({
        where: {
          followerUser: { id: myUser.id },
          followedUser: { id: post.user.id },
          status: FollowStatus.FOLLOWING,
        },
      });

      if (!isFollowing) {
        throw new ForbiddenException('You cannot like a private user’s post');
      }
    }

    post.likes = post.likes ?? [];

    const alreadyLiked = post.likes.includes(myUser.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== myUser.id);
    } else {
      post.likes.push(myUser.id);
    }

    await post.save();

    return {
      status: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    };
  }

  async userPosts(userId: string, params: UserPostDto) {
    const { page = 0, limit = 10 } = params;
    console.log(userId);

    return await this.find({
      where: { user: { id: userId } },
      page,
      limit,
      order: { created_at: 'DESC' },
    });
  }
}
