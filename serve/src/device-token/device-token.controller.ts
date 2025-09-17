import { Public } from '@/auths/public.decorator';
import { DeviceTokenService } from '@/device-token/device-token.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('device-token')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Public()
  @Post()
  async saveToken(@Body('token') token: string) {
    console.log('TOKEN SUDAH SAMPAI DI SERVER', token);

    return this.deviceTokenService.saveToken(token);
  }
}
