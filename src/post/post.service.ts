import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePost } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { isEmpty } from 'lodash';
import {paginate, Paginated, PaginateQuery} from 'nestjs-paginate';
import {Photo} from '../photo/entities/photo.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async create(createPost: CreatePost): Promise<Post> {
    const post = this.postRepository.create({
      ...createPost,
      ownerId: createPost.userId,
    });
    await this.postRepository.save(post);
    return post;
  }

  async edit(postId: number, editPost: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException();

    if (editPost.title) post.title = editPost.title;
    if (editPost.posted) post.posted = editPost.posted;
    if (editPost.content) post.content = editPost.content;
    if (editPost.featured_photos) post.featured_photos = editPost.featured_photos

    await this.postRepository.save(post);
    return post;
  }
  findAll(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.postRepository, {
      defaultSortBy: [['id', 'DESC']],
      sortableColumns: ['id', 'updated_at', 'created_at'],
    });
  }

  findOne(id: number, posted?: boolean): Promise<Post> {
    return this.postRepository.findOneOrFail({
      where: {
        id,
        posted,
      },
    });
  }

  async delete(id: number) {
    return this.postRepository.delete({
      id,
    });
  }

  async toggleVisibility(postId: number) {
    const post = await this.postRepository.findOneOrFail({
      where: {
        id: postId
      }
    })

    post.posted = !post.posted

    return await this.postRepository.save(post)
  }
}
