import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from '@/developers/entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private readonly developerRepository: Repository<Developer>,
  ) {}
  async create(
    createDeveloperDto: CreateDeveloperDto,
    logo_url: Express.Multer.File,
  ): Promise<Developer> {
    const developer = new Developer();
    developer.name = createDeveloperDto.name;
    developer.logo_url = logo_url?.filename;
    developer.website_url = createDeveloperDto.website_url;
    return await this.developerRepository.save(developer);
  }

  async findAll(): Promise<Developer[]> {
    return await this.developerRepository.find();
  }

  async findOne(id: string): Promise<Developer | null> {
    const developer = await this.developerRepository.findOneBy({ id });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }
    return developer;
  }

  async update(
    id: string,
    updateDeveloperDto: UpdateDeveloperDto,
    logo_url: Express.Multer.File,
  ) {
    const developer = await this.developerRepository.findOneBy({ id });
    if (!developer) {
      throw new NotFoundException('Developer not found');
    }
    if (logo_url) {
      if (developer.logo_url !== null) {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads/developer',
          developer.logo_url,
        );
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          throw new Error(error);
        }
        developer.logo_url = logo_url?.filename;
      } else {
        developer.logo_url = logo_url?.filename;
      }
    }
    Object.assign(developer, updateDeveloperDto);
    return await this.developerRepository.save(developer);
  }

  async remove(id: string) {
    await this.developerRepository.delete({ id });
    return { message: 'Delete successfull' };
  }
}
