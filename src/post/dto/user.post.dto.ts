import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UserPostDto {
  @IsOptional()
  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  page: number;

  @IsOptional()
  @ApiProperty({ default: 10 })
  @IsNumber()
  @Min(5)
  @Max(20)
  limit: number;
}
