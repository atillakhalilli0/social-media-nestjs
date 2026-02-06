import { rmSync } from 'fs';
import { join } from 'path';
import { CommonEntity } from 'src/common/common.entity';
import { PostEntity } from 'src/post/post.entity';
import { BeforeRemove, Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ImageEntity extends CommonEntity {
  @Column()
  url: string;

  @Column()
  filename: string;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: 'CASCADE' })
  post: PostEntity;

  @BeforeRemove()
  beforeRemove() {
    rmSync(join(__dirname, '../../upload/', this.filename));
  }
}
