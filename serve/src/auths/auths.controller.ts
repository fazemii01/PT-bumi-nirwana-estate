import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { Public } from '@/auths/public.decorator';
import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Response } from 'express';
import { User } from '@/users/entities/user.entity';
import { GoogleLoginDto } from '@/auths/dto/google-login.dto';

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
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'Login successful',
      user,
      access_token,
    };
  }

  @Public()
  @Post('signup')
  signUp(@Body() createUser: CreateUserDto) {
    return this.authsService.signUp(createUser);
  }

  @Public()
  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authsService.verifyGoogleToken(googleLoginDto);
  }
}
