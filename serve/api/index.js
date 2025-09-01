import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

// let server = express();

// export const bootstrap = async () => {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(server),
//   );

//   app.use(cookieParser());
//   app.enableCors({
//     origin: true,
//     credentials: true,
//   });
//   app.useGlobalPipes(new ValidationPipe());

//   await app.init();
// };
// bootstrap();
// export default server;

let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

export default async function handler(req, res) {
  const server = await bootstrap();
  return server(req, res);
}
