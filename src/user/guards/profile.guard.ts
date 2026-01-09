import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '../user.entity';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private cls: ClsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    let userId = String(req.params.userId || req.query.userId);
    if (!userId) throw new NotFoundException();
    let myUser = await this.cls.get<UserEntity>('user');
    if (myUser.id === userId) return true;
    let user = await this.userService.findOne({
      where: { id: userId, isPrivate: false },
    });
    if (!user) throw new NotFoundException();
    return true;
  }
}
