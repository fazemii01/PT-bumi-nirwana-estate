import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Roles } from '@/auths/role.decorator';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() createBankDto: CreateBankDto) {
    return await this.banksService.create(createBankDto);
  }

  @Roles('ADMIN', 'USER')
  @Get()
  async findAll() {
    return await this.banksService.findAll();
  }

  @Roles('ADMIN', 'USER')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.banksService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return await this.banksService.update(id, updateBankDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.banksService.remove(id);
  }
}
