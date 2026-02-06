import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({example: 'atilla'})
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({example: 'string@gmail.com'})
  @IsEmail()
  email: string;
  
  @ApiProperty({example: '123456'})
  @IsString()
  @MinLength(6)
  password: string;
}
