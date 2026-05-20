import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MessageEvent,
  Param,
  Post,
  Put,
  Query,
  Sse,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse } from '../common/responses/api-response';
import { ApiPaginatedResponse } from '../common/responses/api-response-paginated';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { multerImageOptions } from '../common/utils/multer.util';

@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Sse('events')
  streamEvents(): Observable<MessageEvent> {
    return this.postsService.changes$.pipe(
      map(() => ({ data: { type: 'posts_changed' } }) as MessageEvent),
    );
  }

  @Get()
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar posts por ID de usuario' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página (máx. 200)', example: '10' })
  async findAll(
    @Query('userId') userId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    try {
      const data = await this.postsService.findAll({
        userId,
        page: Math.max(1, parseInt(page) || 1),
        limit: Math.min(200, Math.max(1, parseInt(limit) || 100)),
      });
      return ApiPaginatedResponse.success(data);
    } catch (error) {
      return ApiPaginatedResponse.error((error as Error).message);
    }
  }

  @Get(':id')
  @HttpCode(200)
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
