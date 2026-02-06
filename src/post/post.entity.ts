import { CommonEntity } from 'src/common/common.entity';
import { ImageEntity } from 'src/upload/image.entity';
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

  @OneToMany(() => ImageEntity, (image) => image.post, { cascade: true })
  images: ImageEntity[]

  @Column({ type: 'json', default: [] })
  likes: string[];

  get likesCount(): number {
    return this.likes.length;
  }
}
