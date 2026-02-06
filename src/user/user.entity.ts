import { CommonEntity } from 'src/common/common.entity';
import { FollowEntity } from 'src/follow/follow.entity';
import { PostEntity } from 'src/post/post.entity';
import { ImageEntity } from 'src/upload/image.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  followerCount: number;

  @Column({ default: 0 })
  followedCount: number;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ type: 'enum', enum: Role, default: [Role.USER], array: true })
  role: Role[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.followerUser)
  followers: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.followedUser)
  followeds: FollowEntity[];

  @OneToOne(() => ImageEntity, { nullable: true, eager: true })
  @JoinColumn()
  profilePicture: Partial<ImageEntity>;
}
