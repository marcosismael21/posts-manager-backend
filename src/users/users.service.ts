import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async findAll(search?: string): Promise<Omit<User, 'password'>[]> {
    try {
      const filter: FilterQuery<User> = { isDeleted: false };
      if (search?.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
      }
      return await this.userModel.find(filter).select('-password').sort({ createdAt: -1 }).lean().exec();
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userModel.findOne({ _id: id, isDeleted: false }).select('-password').lean().exec();
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de usuario inválido');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase(), isDeleted: false }).exec();
  }

  async findOneRaw(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async create(dto: CreateUpdateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const exists = await this.userModel.findOne({ email: dto.email.toLowerCase(), isDeleted: false });
      if (exists) throw new ConflictException('El email ya está registrado');
      const hashed = await bcrypt.hash(dto.password, 10);
      const created = await this.userModel.create({ ...dto, password: hashed });
      const { password: _, ...result } = created.toObject();
      return result;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: string, dto: CreateUpdateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);
      const user = await this.userModel
        .findOneAndUpdate({ _id: id, isDeleted: false }, { ...dto, password: hashed }, { new: true })
        .select('-password')
        .lean()
        .exec();
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de usuario inválido');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
      ).lean().exec();
      if (!result) throw new NotFoundException('Usuario no encontrado');
      await this.postModel.updateMany({ userId: id }, { isDeleted: true });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de usuario inválido');
    }
  }
}
