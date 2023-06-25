import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { AdminPostController, PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController, AdminPostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
