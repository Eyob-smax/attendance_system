import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
