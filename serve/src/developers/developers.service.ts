import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Developer } from './developer.entity';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private developersRepository: Repository<Developer>,
  ) {}

  findAll(): Promise<Developer[]> {
    return this.developersRepository.find();
  }

  async findOne(id: string): Promise<Developer> {
    const developer = await this.developersRepository.findOneBy({ id });
    if (!developer) {
      throw new NotFoundException(`Developer with ID "${id}" not found`);
    }
    return developer;
  }

  async create(developerData: Partial<Developer>): Promise<Developer> {
    const newDeveloper = this.developersRepository.create(developerData);
    return this.developersRepository.save(newDeveloper);
  }

  async update(id: string, developerData: Partial<Developer>): Promise<Developer> {
    await this.developersRepository.update(id, developerData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.developersRepository.delete(id);
  }
}
