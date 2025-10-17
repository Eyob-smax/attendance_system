import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BatchesModule } from './batches/batches.module';
import { CourseModule } from './course/course.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, BatchesModule, CourseModule, AttendanceModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
