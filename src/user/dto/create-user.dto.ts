import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../user.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Role })
  role: Role[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
