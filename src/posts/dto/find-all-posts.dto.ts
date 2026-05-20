import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export interface FindAllOptions {
  userId?: string;
  page: number;
  limit: number;
  search?: string;
}

export class FindAllPostsDto {
  @ApiPropertyOptional({ description: 'Filtrar posts por ID de usuario' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Número de página', default: 1, example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Registros por página (máx. 200)', default: 10, example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
