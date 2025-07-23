import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { Developer } from './developer.entity';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  findAll(): Promise<Developer[]> {
    return this.developersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Developer> {
    return this.developersService.findOne(id);
  }

  @Post()
  create(@Body() developerData: Partial<Developer>): Promise<Developer> {
    return this.developersService.create(developerData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() developerData: Partial<Developer>): Promise<Developer> {
    return this.developersService.update(id, developerData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.developersService.remove(id);
  }
}
