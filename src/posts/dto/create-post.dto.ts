import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
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
}
