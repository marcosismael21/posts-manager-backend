import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';
import { ApiResponse } from '../common/responses/api-response';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

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
  async bulkCreate(@Body() dtos: CreateUpdatePostDto[], @CurrentUser() user: JwtPayload) {
    try {
      const data = await this.postsService.bulkCreate(dtos, user.sub);
      return ApiResponse.success(data, `${data.length} posts insertados`);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Post()
  async create(@Body() dto: CreateUpdatePostDto, @CurrentUser() user: JwtPayload) {
    try {
      const data = await this.postsService.create(dto, user.sub);
      return ApiResponse.success(data, 'Post creado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateUpdatePostDto) {
    try {
      const data = await this.postsService.update(id, dto);
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
