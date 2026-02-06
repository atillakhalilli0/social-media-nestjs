import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'post title', example: 'test post title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'post description', example: 'test post desc' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'post images', example: ['test1.jpg', 'test2.jpg'] })
  @IsArray()
  images: string[];
}
