import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUpdateCommentDto {
  @ApiProperty({ example: '6643a1b2c3d4e5f6a7b8c9d0' })
  @IsString()
  @IsNotEmpty()
  postId!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'juanperez@example.com' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Comentario del post...' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  body!: string;  
}
