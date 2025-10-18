import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { BatchesModule } from './batches/batches.module.js';
import { CourseModule } from './course/course.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BatchesModule,
    CourseModule,
    AttendanceModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
