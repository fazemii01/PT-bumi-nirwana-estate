import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Incoming request URL:', req.url);
  const server = await bootstrap();
  server(req, res);
}