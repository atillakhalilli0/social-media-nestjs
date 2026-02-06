import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { FollowEntity, FollowStatus } from './follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { read } from 'fs';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { ClsService } from 'nestjs-cls';
import { UserService } from 'src/user/user.service';
import { CreateFollowDto } from './dto/create.follow.dto';
import { UserEntity } from 'src/user/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class FollowServices {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    private readonly cls: ClsService,
    @Inject(forwardRef(() => UserService))
    private readonly userRepo: UserService,
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
    const { where, select } = params;
    return this.followRepo.findOne({
      where,
      select,
    });
  }

  async findFollowersOfUser() {
    const myUser = await this.cls.get<UserEntity>('user')
    const user= this.followRepo.find({
      where: { followedUser: { id: myUser.id } },
      relations: ['followerUser'],
    });
    if(!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByUserId(userId: string) {
    return this.followRepo.findOne({
      where: {
        followedUser: { id: userId },
      },
      relations: {
        followerUser: true,
        followedUser: true,
      },
    });
  }

  async create(params: CreateFollowDto) {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException('User Not Found');

    const user = await this.userRepo.findOne({ where: { id: params.userId } });
    if (!user) throw new NotFoundException('User Not Found');

    if (myUser.id === user.id)
      throw new BadRequestException('Cant follow yourself');

    const exist = await this.findOne({
      where: {
        followerUser: { id: myUser.id },
        followedUser: { id: user.id },
      },
    });

    if (exist) throw new ConflictException('Already followed');

    const follow = this.followRepo.create({
      followerUser: { id: myUser.id },
      followedUser: { id: user.id },
      status: user.isPrivate ? FollowStatus.WAITING : FollowStatus.FOLLOWING,
    });

    if (!user.isPrivate) {
      user.followerCount++;
      myUser.followedCount++;
      await Promise.all([user.save(), myUser.save()]);
    }

    await follow.save();

    return { success: true };
  }

  async accept(userId: string) {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException('User Not Found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User Not Found');

    const follow = await this.findOne({
      where: {
        followerUser: { id: user.id },
        followedUser: { id: myUser.id },
        status: FollowStatus.WAITING,
      },
    });

    if (!follow) throw new NotFoundException('Follow request not found');

    follow.status = FollowStatus.FOLLOWING;

    myUser.followerCount++;
    user.followedCount++;

    await Promise.all([follow.save(), myUser.save(), user.save()]);

    return { success: true };
  }

  async reject(userId: string) {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException('User Not Found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User Not Found');

    const follow = await this.findOne({
      where: {
        followerUser: { id: user.id },
        followedUser: { id: myUser.id },
        status: FollowStatus.WAITING,
      },
    });

    if (!follow) throw new NotFoundException('Follow request not found');

    await this.followRepo.remove(follow);

    return { success: true };
  }

  async removeFollow(userId: string) {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) {
      throw new NotFoundException('User Not Found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const follow = await this.findOne({
      where: {
        followerUser: { id: user.id }, // o məni follow edir
        followedUser: { id: myUser.id }, // mən
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow Not Found');
    }

    // Əgər artıq accepted idisə → count azaldılır
    if (follow.status === FollowStatus.FOLLOWING) {
      myUser.followerCount--;
      user.followedCount--;

      await Promise.all([myUser.save(), user.save()]);
    }

    // WAITING olsa belə sadəcə silinir (count toxunmur)
    await this.followRepo.remove(follow);

    return {
      success: true,
      message: 'Follower removed successfully',
    };
  }

  async unfollow(userId: string) {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException('User Not Found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User Not Found');

    const follow = await this.findOne({
      where: {
        followerUser: { id: myUser.id },
        followedUser: { id: user.id },
        status: FollowStatus.FOLLOWING,
      },
    });

    if (!follow) throw new NotFoundException('Follow not found');

    myUser.followedCount--;
    user.followerCount--;

    await Promise.all([
      myUser.save(),
      user.save(),
      this.followRepo.remove(follow),
    ]);

    return { success: true };
  }

  async followerList() {
    const myUser = await this.cls.get<UserEntity>('user');
    if (!myUser) {
      throw new NotFoundException('User Not Found');
    }

    return this.followRepo.find({
      where: {
        followedUser: { id: myUser.id },
        status: FollowStatus.WAITING,
      },
      relations: {
        followerUser: true,
      },
      // select: [followerUser:true],
    });
  }

  async acceptAllRequests(userId: string) {
    return await this.followRepo.update(
      {
        followerUser: { id: userId },
        status: FollowStatus.WAITING,
      },
      {
        status: FollowStatus.FOLLOWING,
      },
    );
  }
}
