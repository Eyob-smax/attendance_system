import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { MigrateModule } from '../migrate/migrate.module.js';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [MigrateModule],
})
export class StudentsModule {}
