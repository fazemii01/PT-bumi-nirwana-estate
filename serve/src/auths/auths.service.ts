import { User } from './../users/entities/user.entity';
import { AuthDto } from '@/auths/dto/auth.dto';
import { GoogleLoginDto } from '@/auths/dto/google-login.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(
      authDto.password_hash,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password salah');
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

  async verifyGoogleToken(googleLoginDto: GoogleLoginDto) {
    try {
      const { idToken } = googleLoginDto;

      // Verifikasi ke Google
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );

      if (!response.ok) {
        throw new UnauthorizedException('Invalid Google ID Token');
      }

      const payload = await response.json();

      const email: string = payload.email;
      if (!email) {
        throw new UnauthorizedException('Google token does not contain email');
      }

      let user = await this.usersService.findOneByEmail(email);

      if (!user) {
        user = await this.usersService.create({
          email,
          full_name: payload.name,
          password_hash: '',
          phone_number: '',
        });
      }
      const data = {
        sub: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      };

      return {
        access_token: await this.jwtService.signAsync(data),
        user: user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error(`Google login failed: ${error.message}`);
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
