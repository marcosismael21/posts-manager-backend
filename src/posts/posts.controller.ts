import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse } from '../common/responses/api-response';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { multerImageOptions } from '../common/utils/multer.util';

@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.postsService.findAll();
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.postsService.findOne(id);
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Post('bulk')
  async bulkCreate(@Body() dtos: CreatePostDto[], @CurrentUser() user: JwtPayload) {
    try {
      const data = await this.postsService.bulkCreate(dtos, user.sub);
      return ApiResponse.success(data, `${data.length} posts insertados`);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['title', 'body'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10, multerImageOptions))
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const data = await this.postsService.create(dto, user.sub, files);
      return ApiResponse.success(data, 'Post creado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        keepUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'URLs de imágenes existentes a conservar',
        },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 10, multerImageOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const data = await this.postsService.update(id, dto, files);
      return ApiResponse.success(data, 'Post actualizado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.postsService.remove(id);
      return ApiResponse.success(null, 'Post eliminado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }
}
