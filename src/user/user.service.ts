import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { FindOneParams, FindParams } from 'src/types/find.params';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
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

  async create(dto: CreateUserDto){
    const user = await this.findOne({where: {username: dto.username}});
    if(user){
      throw new ConflictException('User with this username already exists');
    }

    const email = await this.findOne({where: {email: dto.email}});
    if(email){
      throw new ConflictException('User with this email already exists');
    }

    let hashPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashPassword;
    
    const newUser = this.userRepo.create(dto);
    await newUser.save();
    return newUser;
  }
}
