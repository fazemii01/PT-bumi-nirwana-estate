import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class CekEligibilityService {
  private rules: string;

  constructor() {
    const filePath = path.join(
      process.cwd(),
      'src',
      'cek_eligibility',
      'rules.txt',
    );
    this.rules = readFileSync(filePath, 'utf-8');
  }

  async checkEligibilityFromText(question: string): Promise<any> {
    const prompt = `
    Gunakan aturan berikut (jangan mengarang):
    ${this.rules}

    Cek eligibilitas KPR berdasarkan pertanyaan berikut:
    "${question}"

    - Jika pertanyaan menyebutkan setidaknya umur, penghasilan, jumlah pinjaman, dan tenor, anggap relevan.
    - Jika relevan, jawab hanya dalam format JSON:
    {
      "result": "Eligible - alasan singkat"
    }

    - Jika tidak menyebutkan data-data di atas, jawab dalam format JSON:
    {
      "result": "Pertanyaan tidak terkait dengan cek eligibilitas KPR. Mohon tanyakan hal yang relevan."
    }

    Jangan tambahkan teks lain.
    `;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    try {
      let raw = data.response ?? '';

      raw = raw
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.error('Parsing error:', e, 'Raw response:', data.response);
      return {
        result: 'Format jawaban tidak valid dari AI.',
      };
    }
  }
}
