import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParse from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParse());
  await app.listen(process.env.PORT ?? 9800);
}
await bootstrap();
