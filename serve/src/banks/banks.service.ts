import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '@/banks/entities/bank.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { DeletedAtStatus, nowUtc } from '@/types/deleted_at';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async create(
    createBankDto: CreateBankDto,
    logo: Express.Multer.File,
  ): Promise<Bank> {
    const bank = new Bank();
    bank.name = createBankDto.name;
    bank.interest_rate = createBankDto.interest_rate;
    bank.min_tenure = createBankDto.min_tenure;
    bank.max_tenure = createBankDto.max_tenure;
    bank.logo = logo.filename;
    return await this.bankRepository.save(bank);
  }

  async findAll(): Promise<Bank[]> {
    return await this.bankRepository.find({
      where: { status_delete: DeletedAtStatus.NOT_DELETED },
    });
  }

  async findOne(id: string): Promise<Bank | null> {
    const res = await this.bankRepository.findOneBy({ id });
    if (!res) throw new NotFoundException('Bank tidak ditemukan');
    return res;
  }

  async update(
    id: string,
    updateBankDto: UpdateBankDto,
    logo: Express.Multer.File,
  ): Promise<Bank | null> {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new NotFoundException('Bank tidak ditemukan');
    if (logo) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads/banks',
        bank.logo,
      );
      try {
        fs.unlinkSync(filePath);
      } catch (fs) {
        console.error('Failed to delete old logo:', fs.message);
      }
      bank.logo = logo.filename;
    }
    Object.assign(bank, updateBankDto);
    return await this.bankRepository.save(bank);
  }

  async remove(id: string) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new NotFoundException('Bank tidak ditemukan');
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads/banks',
      bank.logo,
    );
    try {
      fs.unlinkSync(filePath);
    } catch (fs) {
      console.error('Failed to delete old logo:', fs.message);
    }

    await this.bankRepository.update(
      { id },
      { status_delete: DeletedAtStatus.DELETED, deleted_at: nowUtc() },
    );
    return { message: 'Bank berhasil dihapus' };
  }
}
