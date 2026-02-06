import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // LOGIN
  // =========================
  async login(dto: LoginDto) {
    const user = await this.userService.findOne({
      where: [
        { username: dto.username },
        { email: dto.email },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // =========================
  // REGISTER
  // =========================
  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findOne({
      where: [
        { email: dto.email },
        { username: dto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.create({
      ...dto,
      role: [Role.USER],
    });

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
