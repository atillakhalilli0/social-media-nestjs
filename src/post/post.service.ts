import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { CreatePostDto } from './dto/create-post.dto';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/user/user.entity';
import { UserPostDto } from './dto/user.post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
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
      skip: (page - 1) * limit,
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

    let post = this.postRepo.create({ ...params, user: { id: myUser.id } });

    await post.save();

    return { status: true, post };
  }

  async toggleLike(userId: string, postId: string) {
    const myUser = await this.cls.get<UserEntity>('user');
    const post = await this.findOne({ where: { id: postId, user: { id: userId } } });
    if (!post) throw new NotFoundException()
    const checkLike = post.likes.includes(myUser.id);
    if(checkLike){
        post.likes = post.likes.filter(userId => userId !== myUser.id);
    }else{
        post.likes.push(myUser.id);
    }
    await post.save();
    return { status: true, liked: !checkLike, likesCount: post.likes.length };
  }

  async userPosts(userId: string, params: UserPostDto) {
    const {page = 0, limit = 10} = params
    return await this.find({ where: { user: { id: userId } }, page, limit, order: { created_at: 'DESC' } });
  }
}
