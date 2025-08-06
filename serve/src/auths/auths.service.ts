import { User } from './../users/entities/user.entity';
import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authDto: AuthDto): Promise<{
    access_token: string;
    user: User;
  }> {
    const user = await this.usersService.findOneByEmail(authDto.email);
    if (
      !user ||
      !(await bcrypt.compare(authDto.password_hash, user.password_hash))
    ) {
      throw new UnauthorizedException(`Invalid credential`);
    }
    const payload = {
      sub: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
