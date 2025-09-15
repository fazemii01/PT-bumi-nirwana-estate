import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '@/banks/entities/bank.entity';
import { Repository } from 'typeorm';
import { CekEligibility } from '@/cek_eligibility/entities/cek_eligibility.entity';
import * as dotenv from 'dotenv';
import { AiService } from '@/ai/ai.service';

dotenv.config();

@Injectable()
export class CekEligibilityService {
  private datasetPath = path.join(process.cwd(), 'src/cek_eligibility/dataset');

  private readonly bankKeywords = {
    bca: 'BCA',
    mandiri: 'Mandiri',
    bni: 'BNI',
    bri: 'BRI',
  };

  private readonly greetings = [
    'halo',
    'helo',
    'hallo',
    'hi',
    'hai',
    'hello',
    'pagi',
    'siang',
    'sore',
    'malam',
    'selamat pagi',
    'selamat siang',
    'selamat sore',
    'selamat malam',
    'apa kabar',
    'halo apa kabar',
  ];

  private readonly thanksResponses = {
    oke: 'Siap! Ada lagi yang bisa saya bantu?',
    siap: 'Baik! Ada yang perlu ditanyakan lagi?',
    'terima kasih': 'Sama-sama! Semoga proses KPR-nya lancar, ya!',
    terimakasih: 'Sama-sama! Semoga proses KPR-nya lancar, ya!',
    mantab: 'Senang bisa membantu!',
    ok: 'Siap! Ada lagi yang bisa saya bantu?',
    oketerimakasih: 'Sama-sama! Semoga proses KPR-nya lancar, ya',
    baikterimakasih: 'Sama-sama! Semoga proses KPR-nya lancar, ya',
    baik: 'Baik! Ada yang perlu ditanyakan lagi?',
  };

  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    @InjectRepository(CekEligibility)
    private readonly cekEligibilityRepository: Repository<CekEligibility>,
    private readonly aiService: AiService,
  ) {}

  async getEligibility(userQuestion: string) {
    const normalizedQuestion = userQuestion.toLowerCase().trim();
    if (this.greetings.includes(normalizedQuestion)) {
      return {
        result:
          'Halo! Ada yang bisa saya bantu dengan pertanyaan kualifikasi eligibilitas KPR di Bumi Nirwana?',
      };
    }

    const thankResponse = this.thanksResponses[normalizedQuestion];
    if (thankResponse) {
      return { result: thankResponse };
    }

    try {
      const bankName = this.detectBankName(userQuestion);
      let bankId: string | null = null;
      if (bankName) {
        const bank = await this.bankRepository.findOne({
          where: { name: bankName },
        });
        if (bank) {
          bankId = bank.id;
        }
      }
      const answer = await this.aiService.query(userQuestion, bankId!);
      console.log('Final Answer from AiService:', answer);
      return answer;
    } catch (error) {
      console.error('Terjadi kesalahan pada alur RAG:', error.message);
      throw new HttpException(
        'Gagal memproses permintaan.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private detectBankName(question: string): string | null {
    const normalizedQuestion = question.toLowerCase();

    for (const keyword in this.bankKeywords) {
      if (normalizedQuestion.includes(keyword)) {
        return this.bankKeywords[keyword];
      }
    }

    return null;
  }
  async seed() {
    const bankFolders = fs.readdirSync(this.datasetPath);

    for (const bankName of bankFolders) {
      const bank = await this.bankRepository
        .createQueryBuilder('bank')
        .where('bank.name ILIKE :name', { name: bankName })
        .getOne();

      const bankId = bank ? bank.id : null;
      if (!bankId) {
        console.error(`Bank ${bankName} tidak ditemukan. Melewati folder ini.`);
        continue;
      }

      const bankPath = path.join(this.datasetPath, bankName);
      const files = fs.readdirSync(bankPath);

      for (const fileName of files) {
        const filePath = path.join(bankPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const rules = fileContent
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && !line.startsWith('-'));

        for (const rule of rules) {
          console.log(bankId);

          const embedding = await this.aiService.embedText(rule);

          await this.cekEligibilityRepository.save({
            bank_id: bankId,
            rule_text: rule,
            embedding: embedding && embedding.length > 0 ? embedding : null,
            metadata: { bank_id: bankId },
          });

          console.log(
            `Inserted rule for ${bankName}: "${rule.substring(0, 50)}..."`,
          );
        }
      }
    }
  }
}
