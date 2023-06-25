import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { unlink } from 'node:fs';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

dotenv.config();

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) { }

  private static domainUrl = process.env.API_DOMAIN || 'localhost:3000';
  private static filePathPrefix = '/public/';

  async create(fileName: string) {
    const photo = this.photoRepository.create({
      file: PhotoService.filePathPrefix + fileName,
      file_url: PhotoService.domainUrl + PhotoService.filePathPrefix + fileName,
    });
    await this.photoRepository.save(photo);
    return { ...photo, url: photo.file_url };
  }

  findAll(query: PaginateQuery): Promise<Paginated<Photo>> {
    return paginate(query, this.photoRepository, {
      defaultSortBy: [['id', 'DESC']],
      sortableColumns: ['id', 'updated_at', 'created_at'],
      relations: { categories: true },
    });
  }

  findAllPosted(query: PaginateQuery): Promise<Paginated<Photo>> {
    const queryBuilder = this.photoRepository
      .createQueryBuilder('photos')
      .innerJoinAndSelect(
        'photos.categories',
        'category',
        'category.posted = :posted',
        { posted: true },
      );
    return paginate<Photo>(query, queryBuilder, {
      defaultSortBy: [['id', 'DESC']],
      sortableColumns: ['id', 'updated_at', 'created_at'],
      relations: { categories: true },
    });
  }

  findOne(id: number) {
    return this.photoRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const file = await this.photoRepository.findOneOrFail({
      where: { id },
    });
    unlink('.' + file.file, (err) => {
      if (err) {
        console.log({ err });
      }
      console.log(`${file.file} was deleted`);
    });
    return await this.photoRepository.delete({ id });
  }
}
