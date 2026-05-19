import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll(): Promise<Post[]> {
    try {
      return await this.postModel.find().sort({ createdAt: -1 }).lean().exec();
    } catch {
      throw new InternalServerErrorException('Error al obtener los posts');
    }
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id).lean().exec();
      if (!post) throw new NotFoundException('Post no encontrado');
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de post inválido');
    }
  }

  async create(dto: CreateUpdatePostDto): Promise<Post> {
    try {
      const created = await this.postModel.create(dto);
      return created.toObject();
    } catch {
      throw new InternalServerErrorException('Error al crear el post');
    }
  }

  async update(id: string, dto: CreateUpdatePostDto): Promise<Post> {
    try {
      const post = await this.postModel
        .findByIdAndUpdate(id, dto, { new: true })
        .lean()
        .exec();
      if (!post) throw new NotFoundException('Post no encontrado');
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de post inválido');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.postModel.findByIdAndDelete(id).lean().exec();
      if (!result) throw new NotFoundException('Post no encontrado');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de post inválido');
    }
  }

  async bulkCreate(dtos: CreateUpdatePostDto[]): Promise<Post[]> {
    try {
      const result = await this.postModel.insertMany(dtos);
      return result.map((doc) => doc.toObject());
    } catch {
      throw new InternalServerErrorException('Error en la carga masiva de posts');
    }
  }
}
