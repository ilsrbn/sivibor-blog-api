import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiQuery, ApiExtraModels,
} from '@nestjs/swagger';
import { User } from 'utils/request.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity'
import {Photo} from '../photo/entities/photo.entity';
import {PaginateQueryOptions} from '../../utils/paginated.schema';
import {Paginate, Paginated, PaginateQuery} from 'nestjs-paginate';
import {AuthGuard} from '@nestjs/passport';

@ApiTags('Admin Post')
@ApiBearerAuth()
@Controller('admin/post')
export class AdminPostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: "Toggle post visibility" })
  @UseGuards(JwtAuthGuard)
  @Post('toggle/:id')
  toggleVisibility(@Param('id') id: string) {
    return this.postService.toggleVisibility(+id)
  }

  @ApiOperation({ summary: 'Create post' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() userId: number) {
    return this.postService.create({ ...createPostDto, userId });
  }

  @ApiOperation({ summary: 'Edit post' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  edit(
    @Param('id') id: string,
    @Body() editPostDto: UpdatePostDto,
  ) {
    return this.postService.edit(+id, { ...editPostDto });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(PostEntity)
  // @ApiResponse({
  //   status: 200,
  //   schema: { ...paginatedSchema(Photo) },
  // })
  @PaginateQueryOptions(PostEntity)
  @ApiOperation({ summary: 'Get all posts' })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PostEntity>> {
    return this.postService.findAll(query);
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(+id);
  }

  @ApiOperation({ summary: 'Delete post by ID' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiExtraModels(PostEntity)
  // @ApiResponse({
  //   status: 200,
  //   schema: { ...paginatedSchema(Photo) },
  // })
  @PaginateQueryOptions(PostEntity)
  @ApiOperation({ summary: 'Get all posts' })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PostEntity>> {
    return this.postService.findAll(query);
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id, true);
  }
}
