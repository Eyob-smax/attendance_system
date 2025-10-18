import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service.js';
import { BatchesController } from './batches.controller.js';

@Module({
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
