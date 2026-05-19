import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentEntity, CommentsDocument } from './schemas/comments.schema';
import { CreateUpdateCommentDto } from './dto/create-update-comments.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(CommentEntity.name) private commentModel: Model<CommentsDocument>) {}

  async findAll(postId?: string): Promise<CommentEntity[]> {
    try {
      const filter = postId ? { postId: new Types.ObjectId(postId) } : {};
      return await this.commentModel.find(filter).sort({ createdAt: -1 }).lean().exec();
    } catch {
      throw new InternalServerErrorException('Error al obtener los comentarios');
    }
  }

  async findOne(id: string): Promise<CommentEntity> {
    try {
      const comment = await this.commentModel.findById(id).lean().exec();
      if (!comment) throw new NotFoundException('Comentario no encontrado');
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de comentario inválido');
    }
  }

  async create(dto: CreateUpdateCommentDto): Promise<CommentEntity> {
    try {
      const created = await this.commentModel.create(dto);
      return created.toObject();
    } catch {
      throw new InternalServerErrorException('Error al crear el comentario');
    }
  }

  async update(id: string, dto: CreateUpdateCommentDto): Promise<CommentEntity> {
    try {
      const comment = await this.commentModel.findByIdAndUpdate(id, dto, { new: true }).lean().exec();
      if (!comment) throw new NotFoundException('Comentario no encontrado');
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de comentario inválido');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.commentModel.findByIdAndDelete(id).lean().exec();
      if (!result) throw new NotFoundException('Comentario no encontrado');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de comentario inválido');
    }
  }
}
