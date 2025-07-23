import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Property } from '../properties/property.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query() queryParams: any): Promise<Property[]> {
    return this.searchService.search(queryParams);
  }
}
