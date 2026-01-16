import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowEntity } from './follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
