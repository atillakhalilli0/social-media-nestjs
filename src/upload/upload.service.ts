import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ImageEntity) private imageRepo: Repository<ImageEntity>,
  ) {}

  async uploadImage(req: Request, file: Express.Multer.File) {
    let port = req.socket.localPort;
    const host = req.hostname;
    const protocol = req.protocol;

    const imageUrl = `${protocol}://${host}:${port}/uploads/${file.filename}`;
    let image = this.imageRepo.create({
      filename: file.filename,
      url: imageUrl,
    });
    image = await this.imageRepo.save(image);
    return image;
  }

  async deleteImage(id: string) {
    const image = await this.imageRepo.findOne({ where: { id } });
    if (image) {
      await this.imageRepo.remove(image);
    }else{throw new NotFoundException()}
  }
}
