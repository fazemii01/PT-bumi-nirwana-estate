import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '@/banks/entities/bank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto): Promise<Bank> {
    const bank = this.bankRepository.create(createBankDto);
    return await this.bankRepository.save(bank);
  }

  async findAll(): Promise<Bank[]> {
    return await this.bankRepository.find();
  }

  async findOne(id: string): Promise<Bank | null> {
    const res = await this.bankRepository.findOneBy({ id });
    if (!res) throw new NotFoundException('Bank tidak ditemukan');
    return res;
  }

  async update(id: string, updateBankDto: UpdateBankDto): Promise<Bank | null> {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new NotFoundException('Bank tidak ditemukan');
    Object.assign(bank, updateBankDto);
    return await this.bankRepository.save(bank);
  }

  async remove(id: string) {
    const bank = await this.bankRepository.findOneBy({ id });
    if (!bank) throw new NotFoundException('Bank tidak ditemukan');
    await this.bankRepository.delete({ id });
    return { message: 'Bank berhasil dihapus' };
  }
}
