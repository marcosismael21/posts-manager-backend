import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { StorageService } from '../storage/storage.service';
import { PaginatedData } from '../common/responses/api-response-paginated';
import { FindAllOptions } from './dto/find-all-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  async findAll(options: FindAllOptions): Promise<PaginatedData<Post>> {
    try {
      const { userId, page, limit } = options;
      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = {};
      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new BadRequestException('ID de usuario inválido');
        }
        filter.userId = new Types.ObjectId(userId);
      }

      const [items, total] = await Promise.all([
        this.postModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        this.postModel.countDocuments(filter).exec(),
      ]);

      return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
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

  async create(dto: CreatePostDto, userId: string, files: Express.Multer.File[]): Promise<Post> {
    try {
      const user = await this.usersService.findOneRaw(userId);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const imageUrls = files?.length
        ? await Promise.all(files.map((f) => this.storageService.upload(f)))
        : [];

      const created = await this.postModel.create({
        ...dto,
        author: user.name,
        userId: new Types.ObjectId(userId),
        imageUrls,
      });
      return created.toObject();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al crear el post');
    }
  }

  async update(id: string, dto: UpdatePostDto, files: Express.Multer.File[]): Promise<Post> {
    try {
      const post = await this.postModel.findById(id).lean().exec();
      if (!post) throw new NotFoundException('Post no encontrado');

      const keepUrls: string[] = dto.keepUrls ?? post.imageUrls ?? [];

      const removedUrls = (post.imageUrls ?? []).filter((url) => !keepUrls.includes(url));
      await Promise.all(removedUrls.map((url) => this.storageService.delete(url)));

      const newUrls = files?.length
        ? await Promise.all(files.map((f) => this.storageService.upload(f)))
        : [];

      const imageUrls = [...keepUrls, ...newUrls];

      const updated = await this.postModel
        .findByIdAndUpdate(id, { ...dto, imageUrls }, { new: true })
        .lean()
        .exec();

      return updated!;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de post inválido');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const post = await this.postModel.findByIdAndDelete(id).lean().exec();
      if (!post) throw new NotFoundException('Post no encontrado');
      if (post.imageUrls?.length) {
        await Promise.all(post.imageUrls.map((url) => this.storageService.delete(url)));
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de post inválido');
    }
  }

  async bulkCreate(dtos: CreatePostDto[], userId: string): Promise<Post[]> {
    try {
      const user = await this.usersService.findOneRaw(userId);
      if (!user) throw new NotFoundException('Usuario no encontrado');
      const docs = dtos.map((dto) => ({
        ...dto,
        author: user.name,
        userId: new Types.ObjectId(userId),
        imageUrls: [],
      }));
      const result = await this.postModel.insertMany(docs);
      return result.map((doc) => doc.toObject());
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error en la carga masiva de posts');
    }
  }
}
