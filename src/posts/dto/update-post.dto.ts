import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto {
  @ApiProperty({ example: 'Título actualizado', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiProperty({ example: 'Contenido actualizado...', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  body?: string;

  @ApiProperty({
    example: ['http://localhost:9000/posts/nestjs.jpg'],
    required: false,
    description: 'URLs de imágenes existentes a conservar',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  keepUrls?: string[];
}
