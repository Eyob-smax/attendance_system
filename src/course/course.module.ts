import { Module } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CourseController } from './course.controller.js';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
