import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateUpdateCommentDto } from './dto/create-update-comments.dto';
import { ApiResponse } from '../common/responses/api-response';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll(@Query('postId') postId?: string) {
    try {
      const data = await this.commentsService.findAll(postId);
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.commentsService.findOne(id);
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Post()
  async create(@Body() dto: CreateUpdateCommentDto) {
    try {
      const data = await this.commentsService.create(dto);
      return ApiResponse.success(data, 'Comentario creado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateUpdateCommentDto) {
    try {
      const data = await this.commentsService.update(id, dto);
      return ApiResponse.success(data, 'Comentario actualizado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.commentsService.remove(id);
      return ApiResponse.success(null, 'Comentario eliminado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }
}
