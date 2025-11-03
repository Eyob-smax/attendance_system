import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
