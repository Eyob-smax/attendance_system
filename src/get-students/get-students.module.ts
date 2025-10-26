import { Module } from '@nestjs/common';
import { GetStudentsService } from './get-students.service.js';
import { GetStudentsController } from './get-students.controller.js';

@Module({
  controllers: [GetStudentsController],
  providers: [GetStudentsService],
})
export class GetStudentsModule {}
