import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttachPhotosDto } from './dto/attach-photos.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../../utils/request.decorators';
import { EditCategoryDto } from './dto/edit-category.dto';
import { Category } from './entities/category.entity';
import { PaginateQueryOptions } from '../../utils/paginated.schema';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiExtraModels(Category)
  @PaginateQueryOptions(Category)
  @ApiOperation({ summary: 'Get all posted categories' })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Category>> {
    return this.categoryService.findAllPosted(query);
  }

  @Get(':id')
  @ApiExtraModels(Category)
  @PaginateQueryOptions(Category)
  @ApiOperation({ summary: 'Get posted category by ID' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id, true);
  }
}

@ApiTags('Admin Category')
@ApiBearerAuth()
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(Category)
  @PaginateQueryOptions(Category)
  @ApiOperation({ summary: 'Get all categories' })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Category>> {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post('photos/attach/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Attach photos to category' })
  attachPhotos(@Param('id') id: string, @Body() body: AttachPhotosDto) {
    return this.categoryService.setPhotos(+id, body.photos);
  }

  @Post('photos/detach/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Detach photos from category' })
  detachPhotos(@Param('id') id: string, @Body() body: AttachPhotosDto) {
    return this.categoryService.detachPhotos(+id, body.photos);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create category' })
  create(@Body() body: CreateCategoryDto, @User() id: string) {
    return this.categoryService.create(body, +id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit Category by ID' })
  edit(
    @Body() body: EditCategoryDto,
    @Param('id') id: string,
    @User() ownerId: string,
  ) {
    return this.categoryService.edit(+id, body);
  }

  @Post('cover/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set cover' })
  setCover(
    @Param('categoryId') categoryId: string,
    @Query('photoId') photoId: string,
  ) {
    return this.categoryService.setCover(+categoryId, +photoId);
  }

  @Post('status/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle posted Status' })
  toggle(@Param('categoryId') categoryId: string) {
    return this.categoryService.toggleVisibility(+categoryId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string) {
    return this.categoryService.delete(+id);
  }
}
