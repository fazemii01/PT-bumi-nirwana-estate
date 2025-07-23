import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { Property } from '../properties/property.entity';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
