import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { BatchesModule } from './batches/batches.module.js';
import { CourseModule } from './course/course.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './redis/redis.module.js';
import { CourseDateModule } from './course-date/course-date.module.js';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { StudentsModule } from './students/students.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module.js';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { CommonInterceptor } from './common/interceptors/cache.interceptor.js';
// import { GeneralInterceptor } from './common/interceptors/common.interceptor.js';
import { join } from 'path';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { MigrateModule } from './migrate/migrate.module.js';
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BatchesModule,
    CourseModule,
    AttendanceModule,
    CourseDateModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    StudentsModule,
    ScheduleModule.forRoot(),
    TasksModule,
    RedisModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      graphiql: true,
    }),
    AnalyticsModule,
    MigrateModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: GeneralInterceptor,
    // },
  ],
})
export class AppModule {}
