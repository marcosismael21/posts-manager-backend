import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_SIZE_BYTES = 6 * 1024 * 1024; // 6MB

export const multerImageOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`), false);
    }
    cb(null, true);
  },
};
