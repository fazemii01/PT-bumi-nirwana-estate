import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from '@/auths/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => {
        const secret = ConfigService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in enviroment variable');
        }
        return {
          secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthsController],
  providers: [AuthsService, JwtStrategy],
  exports: [AuthsService],
})
export class AuthsModule {}
