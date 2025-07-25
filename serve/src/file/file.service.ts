import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  private readonly uploadPath = join('/tmp', 'uploads');

  constructor() {
    this.ensureUploadsDirectoryExists();
  }

  private async ensureUploadsDirectoryExists() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);
    return `/uploads/${fileName}`;
  }
}
