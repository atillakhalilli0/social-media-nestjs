import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
  ) {}

  async login(params: LoginDto) {
    const user = await this.userservice.findOne({
      where: [{ username: params.username }, { email: params.email }],
    });

    if (!user) throw new NotFoundException();

    let checkPassword = await bcrypt.compare(params.password, user.password);
    if (!checkPassword) throw new ConflictException();

    let payload = { role: user.role, id: user.id };

    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async register(dto: RegisterDto) {
    const user = await this.userservice.create({ ...dto, role: [Role.USER] });
    let payload = { role: user.role, id: user.id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
