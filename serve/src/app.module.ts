import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { AgentsModule } from './agents/agents.module';
import { PropertiesModule } from './properties/properties.module';
import { FileModule } from './file/file.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserFavoritesModule } from './user-favorites/user-favorites.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import postgres from 'postgres'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Shouldn't be used in production
      }),
      inject: [ConfigService],
    }),
    DevelopersModule,
    AgentsModule,
    PropertiesModule,
    FileModule,
    SearchModule,
    UsersModule,
    AuthModule,
    UserFavoritesModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
