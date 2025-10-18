import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { PrismaClient } from '@prisma/client';
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
