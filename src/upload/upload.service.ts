import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ImageEntity) private imageRepo: Repository<ImageEntity>,
  ) {}

  // async uploadImage(req: Request, file: Express.Multer.File) {
  //   let port = req.socket.localPort;
  //   const host = req.hostname;
  //   const protocol = req.protocol;

  //   const imageUrl = `${protocol}://${host}:${port}/upload/${file.filename}`;
  //   let image = this.imageRepo.create({
  //     filename: file.filename,
  //     url: imageUrl,
  //   });
  //   console.log(image, image.url);

  //   image = await this.imageRepo.save(image);
  //   return image;
  // }

  async uploadImage(req: Request, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fayl göndərilməyib');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Yalnız jpg, jpeg və png formatlı şəkillərə icazə verilir',
      );
    }

    const port = req.socket.localPort;

    const image = this.imageRepo.create({
      filename: file.filename,
      url: `${req.protocol}://${req.hostname}${
        port ? `:${port}` : ''
      }/upload/${file.filename}`,
    });

    await image.save();
    return image;
  }

  async deleteImage(id: string) {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (image) {
      await this.imageRepo.remove(image);
    } else {
      throw new NotFoundException();
    }
    return { message: 'Image deleted successfully' };
  }
}
