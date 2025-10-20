import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { BatchesModule } from './batches/batches.module.js';
import { CourseModule } from './course/course.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './redis/redis.module.js';
import { CourseDateModule } from './course-date/course-date.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BatchesModule,
    CourseModule,
    AttendanceModule,
    RedisModule,
    CourseDateModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
