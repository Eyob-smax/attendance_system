import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: Request, res: Response) => {
    res.send('Attendance API is running on Vercel!');
  });

  await app.listen(9800);
}

await bootstrap();
