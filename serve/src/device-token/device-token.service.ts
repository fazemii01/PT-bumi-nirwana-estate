import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private readonly tokenRepository: Repository<DeviceToken>,
  ) {}

  async saveToken(token: string): Promise<DeviceToken> {
    const existingToken = await this.tokenRepository.findOneBy({ token });

    if (existingToken) {
      return existingToken;
    }

    const newToken = this.tokenRepository.create({ token });
    return this.tokenRepository.save(newToken);
  }
}
