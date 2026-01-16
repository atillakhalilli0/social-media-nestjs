import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../uploads'),
        filename: function (req, file, cb) {
          cb(null, `${Date.now()} ${extname(file.originalname.toLowerCase())}`);
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UploadModule {}
