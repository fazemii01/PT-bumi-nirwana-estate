import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  findAll(): Promise<Property[]> {
    return this.propertiesRepository.find({ relations: ['developer', 'agent', 'images', 'floor_plans'] });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({ where: { id }, relations: ['developer', 'agent', 'images', 'floor_plans'] });
    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }
    return property;
  }

  async create(propertyData: Partial<Property>): Promise<Property> {
    const newProperty = this.propertiesRepository.create(propertyData);
    return this.propertiesRepository.save(newProperty);
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property> {
    await this.propertiesRepository.update(id, propertyData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}
