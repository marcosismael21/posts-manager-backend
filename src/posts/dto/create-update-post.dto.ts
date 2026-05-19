import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUpdatePostDto {
  @ApiProperty({ example: 'Mi primer post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: 'Contenido del post...' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  body!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  author!: string;
}
