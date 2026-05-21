import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.config.get<string>('MINIO_ENDPOINT')!,
      port: parseInt(this.config.get<string>('MINIO_PORT')!),
      useSSL: false,
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.config.get<string>('MINIO_SECRET_KEY')!,
    });
    this.bucket = this.config.get<string>('MINIO_BUCKET')!;
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) await this.client.makeBucket(this.bucket);
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const filename = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
    await this.client.putObject(this.bucket, filename, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    const publicUrl = this.config.get<string>('MINIO_PUBLIC_URL');
    return `${publicUrl}/${this.bucket}/${filename}`;
  }

  async delete(url: string): Promise<void> {
    try {
      const filename = url.split('/').pop()!;
      await this.client.removeObject(this.bucket, filename);
    } catch {}
  }
}
