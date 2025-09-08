import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export function UseMultipleFileUploadInterceptor(folder: string) {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'property_images', maxCount: 10 },
          { name: 'property_floor_plans', maxCount: 10 },
          { name: 'news_images', maxCount: 10 },
        ],
        {
          storage: diskStorage({
            destination: (req, file, cb) => {
              const basePath = `./uploads/${folder}`;
              let subFolder = 'others';

              if (file.fieldname === 'property_images') {
                subFolder = 'property_images';
              } else if (file.fieldname === 'property_floor_plans') {
                subFolder = 'property_floor_plans';
              } else if (file.fieldname == 'news_images') {
                subFolder = 'news_images';
              }

              const fullPath = `${basePath}/${subFolder}`;
              fs.mkdirSync(fullPath, { recursive: true });

              cb(null, fullPath);
            },
            filename(req, file, callback) {
              const uniqueSuffix =
                Date.now() + '_' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              callback(null, `${uniqueSuffix}${ext}`);
            },
          }),
        },
      ),
    ),
  );
}
