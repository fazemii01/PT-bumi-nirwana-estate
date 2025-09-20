import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export function UseMultipleFileUploadInterceptor(folder: string) {
  const folderMap: Record<string, string> = {
    property_images: 'property_images',
    property_site_plans: 'property_site_plans',
    building_images: 'building_images',
    building_floor_plans: 'building_floor_plans',
    news_images: 'news_images',
  };

  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'property_images', maxCount: 10 },
          { name: 'property_site_plans', maxCount: 10 },
          { name: 'building_images', maxCount: 10 },
          { name: 'building_floor_plans', maxCount: 10 },
          { name: 'news_images', maxCount: 10 },
        ],
        {
          storage: diskStorage({
            destination: (req, file, cb) => {
              const basePath = `./uploads/${folder}`;

              const subFolder = folderMap[file.fieldname] || 'others';

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
