import { rmSync } from 'fs';
import { join } from 'path';
import { CommonEntity } from 'src/common/common.entity';
import { BeforeRemove, Column, Entity } from 'typeorm';

@Entity()
export class ImageEntity extends CommonEntity {
  @Column()
  url: string;

  @Column()
  filename: string;

  @BeforeRemove()
  beforeRemove() {
    rmSync(join(__dirname, '../../uploads/', this.filename));
  }
}
