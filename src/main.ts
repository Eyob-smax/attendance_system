import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParse from 'cookie-parser';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParse());
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.get('/', (req: Request, res: Response) => {
    res.send('/Attendance API is running!');
  });
  await app.listen(process.env.PORT ?? 9800);
}
await bootstrap();
