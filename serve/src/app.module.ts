import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AgentsModule } from './agents/agents.module';
import { AuthsModule } from './auths/auths.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { DevelopersModule } from './developers/developers.module';
import { UserFavoritesModule } from './user-favorites/user-favorites.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '@/auths/jwt-auth-guard.guard';
import { RoleGuard } from '@/auths/auths.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FeedbackModule } from './feedbackform/feedback.module';
import { join } from 'path';
import { BanksModule } from './banks/banks.module';
import { LoanSimulationsModule } from './loan_simulations/loan_simulations.module';
import { FileStorageService } from './file-storage/file-storage.service';
import { NewsCategoryModule } from './news_category/news_category.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
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
    FeedbackModule,
    AgentsModule,
    AuthsModule,
    ChatbotModule,
    DevelopersModule,
    UserFavoritesModule,
    BanksModule,
    LoanSimulationsModule,
    NewsCategoryModule,
    NewsModule,
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
    FileStorageService,
  ],
})
export class AppModule {}
