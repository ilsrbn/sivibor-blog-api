import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SharpPipe } from '../../utils/sharp.pipe';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Photo } from './entities/photo.entity';
import {
  paginatedSchema,
  PaginateQueryOptions,
} from '../../utils/paginated.schema';

@ApiTags('Admin Photo')
@ApiBearerAuth()
@Controller('admin/photo')
export class AdminPhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: AdminPhotoController.schema,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create optimized .webp photo' })
  create(@UploadedFile(SharpPipe) file: string) {
    return this.photoService.create(file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete photo by ID' })
  remove(@Param('id') id: string) {
    return this.photoService.remove(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(Photo)
  // @ApiResponse({
  //   status: 200,
  //   schema: { ...paginatedSchema(Photo) },
  // })
  @PaginateQueryOptions(Photo)
  @ApiOperation({ summary: 'Get all photos' })
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Photo>> {
    return this.photoService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get photo by ID' })
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(+id);
  }


  private static schema = {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  };
}
@ApiTags('Photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  @ApiResponse({
    status: 200,
    schema: { ...paginatedSchema(Photo) },
    description: 'Returns paginated photos',
  })
  @ApiOperation({ summary: 'Get all posted photos' })
  @PaginateQueryOptions(Photo)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Photo>> {
    return this.photoService.findAllPosted(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get posted photo by ID' })
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(+id);
  }
}
