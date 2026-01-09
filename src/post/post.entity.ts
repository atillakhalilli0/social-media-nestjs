import { CommonEntity } from 'src/common/common.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class PostEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'json', default: [] })
  likes: string[];

  get likesCount(): number {
    return this.likes.length;
  }
}
