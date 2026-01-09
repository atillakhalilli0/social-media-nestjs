import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'post description', example: 'sjsjsjs' })
  @IsString()
  @IsOptional()
  description?: string;
}
