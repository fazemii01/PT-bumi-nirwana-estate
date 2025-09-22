import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AgentsModule } from './agents/agents.module';
import { AuthsModule } from './auths/auths.module';
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
import { NewsCategoryModule } from './news_category/news_category.module';
import { NewsModule } from './news/news.module';
// import { CekEligibilityModule } from './cek_eligibility/cek_eligibility.module';
// import { OllamaService } from '@/ollama/ollama.service';
// import { AiService } from './ai/ai.service';
// import { AiModule } from './ai/ai.module';
// import { OllamaModule } from './ollama/ollama.module';
// import { FcmService } from './fcm/fcm.service';
// import { FcmModule } from './fcm/fcm.module';
import { DeviceTokenModule } from './device-token/device-token.module';
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
        synchronize: false, // Shouldn't be used in production
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
    DevelopersModule,
    UserFavoritesModule,
    BanksModule,
    LoanSimulationsModule,
    NewsCategoryModule,
    NewsModule,
    // CekEligibilityModule,
    // AiModule,
    // OllamaModule,
    // FcmModule,
    DeviceTokenModule,
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
    // AiService,
    // FcmService,
  ],
})
export class AppModule {}
