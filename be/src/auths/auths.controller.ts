import { Controller, Post, Body } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { Public } from '@/auths/public.decorator';
import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Public()
  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authsService.signIn(authDto);
  }

  @Public()
  @Post('signup')
  signUp(@Body() createUser: CreateUserDto) {
    return this.authsService.signUp(createUser);
  }
}
