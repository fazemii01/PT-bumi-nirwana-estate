import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
