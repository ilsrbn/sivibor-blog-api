import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AdminPhotoController, PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), PostModule],
  controllers: [PhotoController, AdminPhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
