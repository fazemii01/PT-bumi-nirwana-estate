import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Roles } from '@/auths/role.decorator';
import { UseFileUploadInterceptor } from '@/file/upload.interceptor';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post()
  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo_url', 'developer')
  create(
    @Body() createDeveloperDto: CreateDeveloperDto,
    @UploadedFile() logo_url: Express.Multer.File,
  ) {
    return this.developersService.create(createDeveloperDto, logo_url);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.developersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.developersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo_url', 'developer')
  update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
    @UploadedFile() logo_url: Express.Multer.File,
  ) {
    return this.developersService.update(id, updateDeveloperDto, logo_url);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }
}
