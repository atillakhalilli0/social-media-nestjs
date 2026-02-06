import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { ClsService } from 'nestjs-cls';
import { FollowServices } from 'src/follow/follow.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly followService: FollowServices,
    private readonly cls: ClsService,
  ) {}

  find(params: FindParams<UserEntity>) {
    const { where, select, limit, page } = params;
    return this.userRepo.find({
      where,
      select,
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });
  }

  findOne(params: FindOneParams<UserEntity>) {
    const { where, select } = params;
    return this.userRepo.findOne({
      where,
      select,
    });
  }

  async create(dto: CreateUserDto) {
    const user = await this.findOne({ where: { username: dto.username } });
    if (user) {
      throw new ConflictException('User with this username already exists');
    }

    const email = await this.findOne({ where: { email: dto.email } });
    if (email) {
      throw new ConflictException('User with this email already exists');
    }

    let hashPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashPassword;

    const newUser = this.userRepo.create(dto);
    await newUser.save();
    return newUser;
  }

  async update(dto: UpdateUserDto) {
    let myUser = this.cls.get<UserEntity>('user');
    const user = await this.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (user && user.username !== myUser.username) {
      throw new ConflictException('User with this username already exists');
    }
    if (user && user.email !== myUser.email) {
      throw new ConflictException('User with this email already exists');
    }

    let payload: Partial<UserEntity> = {};
    for (let key in dto) {
      switch (key) {
        case 'profilePicture':
          payload.profilePicture = { id: dto.profilePicture };
          break;
        case 'isPrivate':
          payload.isPrivate = dto.isPrivate;
          if (dto.isPrivate == false) {
            await this.followService.acceptAllRequests(myUser.id);
            myUser.followerCount++;
            await myUser.save();
          }
          break;

        default:
          payload[key] = dto[key];
          break;
      }
    }
    await this.userRepo.update({ id: myUser.id }, payload);
    return {status: true , message: 'Profile updated successfully'}
  }
}
