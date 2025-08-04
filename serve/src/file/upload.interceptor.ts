import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function UseFileUploadInterceptor(field: string, folder: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(field, {
        storage: diskStorage({
          destination: `./uploads/${folder}`,
          filename(req, file, callback) {
            const uniqueSuffix =
              Date.now() + '_' + Math.round(Math.random() * 1e9);
            callback(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      }),
    ),
  );
}
