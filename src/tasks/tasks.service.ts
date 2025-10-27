import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // Runs every minute
  //   @Cron('*')
  //   handleCron() {
  //     this.logger.debug('Called every minute');
  //   }

  //   @Cron('30 2 * * *')
  //   handleDailyTask() {
  //     this.logger.debug('Running daily task at 2:30 AM');
  //   }
}
