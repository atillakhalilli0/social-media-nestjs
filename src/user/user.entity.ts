import { CommonEntity } from 'src/common/common.entity';
import { FollowEntity } from 'src/follow/follow.entity';
import { PostEntity } from 'src/post/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class UserEntity extends CommonEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.USER, array: true })
  role: Role[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.followerUser)
  followers: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.followedUser)
  followeds: FollowEntity[];

  @Column({ default: 0 })
  followerCount: number;

  @Column({ default: 0 })
  followedCount: number;
}
