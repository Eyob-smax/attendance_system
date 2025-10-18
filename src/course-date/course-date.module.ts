import { Module } from '@nestjs/common';
import { CourseDateService } from './course-date.service.js';
import { CourseDateController } from './course-date.controller.js';

@Module({
  controllers: [CourseDateController],
  providers: [CourseDateService],
})
export class CourseDateModule {}
