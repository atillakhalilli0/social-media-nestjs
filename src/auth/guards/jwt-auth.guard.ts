import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ClsService } from 'nestjs-cls';

export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private cls: ClsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    let token = req.headers.authorization || '';
    token = token.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      let payload = await this.jwtService.verify(token);
      if (!payload.userId) throw new Error('Invalid token payload');
      let user = await this.userService.findOne({
        where: { id: payload.userId },
      });
      if (!user) throw new Error('User not found');
      this.cls.set('user', user);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
