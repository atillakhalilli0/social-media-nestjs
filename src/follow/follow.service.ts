import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity, FollowStatus } from './follow.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/user/user.service';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { UserEntity } from 'src/user/user.entity';
import { CreateFollowDto } from './dto/create-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepo: Repository<FollowEntity>,
    private cls: ClsService,
    private userService: UserService,
  ) {}

  find(params: FindParams<FollowEntity>) {
    const { where, select, limit, page } = params;
    return this.followRepo.find({
      where,
      select,
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });
  }

  findOne(params: FindOneParams<FollowEntity>) {
    const { where, select, relations } = params;
    return this.followRepo.findOne({
      where,
      select,
      relations,
    });
  }

  async create(dto: CreateFollowDto) {
    const myUser = this.cls.get<UserEntity>('user');
    const user = await this.userService.findOne({ where: { id: dto.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!myUser) {
      throw new NotFoundException('User not found');
    }

    if (user.id === myUser.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.findOne({
      where: { followerUser: { id: user.id }, followedUser: { id: myUser.id } },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    const follow = this.followRepo.create({
      followerUser: { id: user.id },
      followedUser: { id: myUser.id },
      status: user.isPrivate ? FollowStatus.WAITING : FollowStatus.FOLLOW,
    });

    if(!user.isPrivate) {
        user.followerCount += 1;
        myUser.followedCount += 1;

        await Promise.all([user.save(), myUser.save()]);
    }

    await follow.save();
    return follow;
  }
}
