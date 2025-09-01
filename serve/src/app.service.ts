import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 'ok',
      message: 'PT Bumi Nirwana Estate API is running!',
      timestamp: new Date().toISOString(),
    };
  }
}
