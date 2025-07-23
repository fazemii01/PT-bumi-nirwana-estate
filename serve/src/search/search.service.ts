import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Property } from '../properties/property.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async search(queryParams: any): Promise<Property[]> {
    const { keyword, minPrice, maxPrice, sortBy, order = 'ASC' } = queryParams;
    const query = this.propertiesRepository.createQueryBuilder('property');

    if (keyword) {
      query.where('property.name ILIKE :keyword OR property.description ILIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (minPrice) {
      query.andWhere('property.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('property.price <= :maxPrice', { maxPrice });
    }

    if (sortBy) {
      query.orderBy(`property.${sortBy}`, order);
    }

    return query.getMany();
  }
}
