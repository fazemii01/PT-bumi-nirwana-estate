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
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Roles } from '@/auths/role.decorator';
import { UseFileUploadInterceptor } from '@/file/upload.interceptor';
import * as fs from 'fs';
import { Bank } from '@/banks/entities/bank.entity';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo', 'banks')
  @Post()
  async create(
    @Body() createBankDto: CreateBankDto,
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<Bank> {
    try {
      return await this.banksService.create(createBankDto, logo);
    } catch (error) {
      try {
        await fs.promises.unlink(logo.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Roles('ADMIN', 'USER')
  @Get()
  async findAll(): Promise<Bank[]> {
    return await this.banksService.findAll();
  }

  @Roles('ADMIN', 'USER')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Bank | null> {
    return await this.banksService.findOne(id);
  }

  @Roles('ADMIN')
  @UseFileUploadInterceptor('logo', 'banks')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankDto: UpdateBankDto,
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<Bank | null> {
    try {
      return await this.banksService.update(id, updateBankDto, logo);
    } catch (error) {
      try {
        await fs.promises.unlink(logo.path);
      } catch (error) {
        console.log(error);
      }
      throw error;
    }
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.banksService.remove(id);
  }
}
