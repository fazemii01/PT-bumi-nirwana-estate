import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AgentsModule } from './agents/agents.module';
import { AuthsModule } from './auths/auths.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { DevelopersModule } from './developers/developers.module';
import { SearchModule } from './search/search.module';
import { UserFavoritesModule } from './user-favorites/user-favorites.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '@/auths/jwt-auth-guard.guard';
import { RoleGuard } from '@/auths/auths.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Shouldn't be used in production
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PropertiesModule,
    AgentsModule,
    AuthsModule,
    ChatbotModule,
    DevelopersModule,
    SearchModule,
    UserFavoritesModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
