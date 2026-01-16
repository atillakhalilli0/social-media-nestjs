import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
