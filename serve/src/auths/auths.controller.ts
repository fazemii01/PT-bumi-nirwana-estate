import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { Public } from '@/auths/public.decorator';
import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Response } from 'express';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Public()
  @Post('signin')
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authsService.signIn(authDto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // jika pakai HTTPS
      sameSite: 'lax', // atau 'strict' tergantung kebutuhan
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    });

    return {
      message: 'Login successful',
      user, // Tambahkan data user di sini
    };
  }

  @Public()
  @Post('signup')
  signUp(@Body() createUser: CreateUserDto) {
    return this.authsService.signUp(createUser);
  }
}
