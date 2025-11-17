import { Module } from '@nestjs/common';
import { MigrateService } from './migrate.service.js';
import { MigrateController } from './migrate.controller.js';

@Module({
  controllers: [MigrateController],
  providers: [MigrateService],
  exports: [MigrateService],
})
export class MigrateModule {}
