import { Injectable, BadRequestException } from '@nestjs/common';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class MigrateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async migrateStudent(fromBatchId: number, toBatchId: number) {
    try {
      if (fromBatchId === toBatchId) {
        throw new BadRequestException(
          'Source and destination batch cannot be the same.',
        );
      }

      const activeStudents = await this.databaseService.studentBatch.findMany({
        where: {
          batch_id: fromBatchId,
          is_active: true,
        },
        include: {
          student: true,
        },
      });

      if (activeStudents.length === 0) {
        throw new BadRequestException(
          'No active students found in the selected batch.',
        );
      }

      await this.databaseService.$transaction(async (tx) => {
        for (const sb of activeStudents) {
          await tx.studentBatch.update({
            where: { id: sb.id },
            data: {
              is_active: false,
              leave_date: new Date(),
            },
          });

          await tx.studentBatch.create({
            data: {
              student_id: sb.student_id,
              batch_id: toBatchId,
              is_active: true,
            },
          });

          await tx.student.update({
            where: { student_id: sb.student_id },
            data: {
              current_batch_id: toBatchId,
            },
          });
        }
      });

      return {
        migrated: activeStudents.length,
        message: `Successfully migrated ${activeStudents.length} students from batch ${fromBatchId} to ${toBatchId}.`,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }
}
