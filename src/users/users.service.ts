import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUpdateUserDto } from './dto/create-update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      return await this.userModel.find().select('-password').sort({ createdAt: -1 }).lean().exec();
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userModel.findById(id).select('-password').lean().exec();
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de usuario inválido');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findOneRaw(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUpdateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() });
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
        .findByIdAndUpdate(id, { ...dto, password: hashed }, { new: true })
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
      const result = await this.userModel.findByIdAndDelete(id).lean().exec();
      if (!result) throw new NotFoundException('Usuario no encontrado');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('ID de usuario inválido');
    }
  }
}
