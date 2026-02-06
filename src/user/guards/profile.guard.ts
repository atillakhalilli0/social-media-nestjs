import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity, FollowStatus } from 'src/follow/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly cls: ClsService,
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const userId = String(req.params.userId || req.query.userId);
    if (!userId) throw new NotFoundException();

    const myUser = this.cls.get<UserEntity>('user');
    if (!myUser) throw new NotFoundException();

    if (myUser.id === userId) return true;

    const targetUser = await this.userService.findOne({
      where: { id: userId },
    });
    if (!targetUser) throw new NotFoundException();

    if (!targetUser.isPrivate) return true;

    const isFollowing = await this.followRepo.exist({
      where: {
        followerUser: { id: myUser.id },
        followedUser: { id: targetUser.id },
        status: FollowStatus.FOLLOWING,
      },
    });

    if (!isFollowing) {
      throw new ForbiddenException(
        'You are not allowed to view this private profile',
      );
    }

    return true;
  }
}
