import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';
import { ApiResponse } from '../common/responses/api-response';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    try {
      const data = await this.usersService.findAll(search);
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.usersService.findOne(id);
      return ApiResponse.success(data);
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Post()
  async create(@Body() dto: CreateUpdateUserDto) {
    try {
      const data = await this.usersService.create(dto);
      return ApiResponse.success(data, 'Usuario creado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateUpdateUserDto) {
    try {
      const data = await this.usersService.update(id, dto);
      return ApiResponse.success(data, 'Usuario actualizado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return ApiResponse.success(null, 'Usuario eliminado');
    } catch (error) {
      return ApiResponse.error((error as Error).message);
    }
  }
}
