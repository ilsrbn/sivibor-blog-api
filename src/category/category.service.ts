import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { PhotoService } from '../photo/photo.service';
import {CreateCategoryDto} from './dto/create-category.dto';
import {EditCategoryDto} from './dto/edit-category.dto';
import {paginate, Paginated, PaginateQuery} from 'nestjs-paginate';
interface CategoryPostedFilter {
  where: {
    id: number
    posted?: boolean
  }
}
@Injectable()
export class CategoryService {
  constructor(
    private readonly photoService: PhotoService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(body: CreateCategoryDto, ownerId: number): Promise<Category> {
    const category = this.categoryRepository.create({
      ...body,
      ownerId
    })
    await this.categoryRepository.save(category)
    return category
  }

  async edit(categoryId: number, body: EditCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail({ where: { id: categoryId } })

    if (body.title) category.title = body.title
    if (body.posted !== undefined) category.posted = body.posted
    if (body.description) category.description = body.description

    await this.categoryRepository.save(category)
    return category
  }

  findAll(query: PaginateQuery): Promise<Paginated<Category>> {
    return paginate(query, this.categoryRepository, {
      defaultSortBy: [['id', 'DESC']],
      sortableColumns: ['id', 'updated_at', 'created_at'],
      relations: {
        cover: true,
      }
    });
  }

  findAllPosted(query: PaginateQuery): Promise<Paginated<Category>> {
    return paginate(query, this.categoryRepository, {
      defaultSortBy: [['id', 'DESC']],
      sortableColumns: ['id', 'updated_at', 'created_at'],
      relations: {
        cover: true,
      },
      where: {
        posted: true
      }
    });
  }

  async findOne(id: number, posted?: boolean) {
    const findOptions: CategoryPostedFilter = {
      where: { id }
    }
    if (posted !== undefined) findOptions.where.posted = posted
    return await this.categoryRepository.findOneOrFail(findOptions);
  }

  async setPhotos(categoryId: number, photosIds: number[]) {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id: categoryId },
    });
    const newPhotos = []
    for (const photoId of photosIds) {
      const photo = await this.photoService.findOne(photoId);
      if (photo) newPhotos.push(photo);
    }
    category.photos = newPhotos
    return await this.categoryRepository.save(category);
  }

  async attachPhotos(categoryId: number, photosIds: number[]) {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id: categoryId },
    });
    for (const photoId of photosIds) {
      const photo = await this.photoService.findOne(photoId);
      if (photo) category.photos.push(photo);
    }
    return await this.categoryRepository.save(category);
  }

  async detachPhotos(categoryId: number, photosIds: number[]) {
    const category = await this.categoryRepository.findOneOrFail({
      where: { id: categoryId },
    });
    for (const photoId of photosIds) {
      category.photos = category.photos.filter((photo) => photo.id !== photoId);
    }
    return await this.categoryRepository.save(category);
  }

  async setCover(categoryId: number, photoId: number) {
    const category = await this.categoryRepository.findOneOrFail({ where: { id: categoryId } })
    const photo = await this.photoService.findOne(photoId)
    if (photo) {
      category.cover = photo
      await this.categoryRepository.save(category)
    }
    return category
  }

  async toggleVisibility(categoryId: number) {
    const category = await this.categoryRepository.findOneOrFail({ where: { id: categoryId } })
    category.posted = !category.posted
    await this.categoryRepository.save(category)
    return category
  }

  async delete(categoryId: number) {
    return await this.categoryRepository.delete({ id: categoryId })
  }
}
