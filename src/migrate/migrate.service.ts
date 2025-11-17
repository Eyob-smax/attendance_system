import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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

  async getStudentBatchEntries() {
    try {
      return await this.databaseService.studentBatch.findMany({
        include: {
          student: true,
          batch: true,
        },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }

  async getStudentBatchById(id: number) {
    try {
      const entry = await this.databaseService.studentBatch.findUnique({
        where: { id },
        include: {
          student: true,
          batch: true,
        },
      });

      if (!entry) {
        throw new NotFoundException(`StudentBatch with ID ${id} not found`);
      }

      return entry;
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }

  async createStudentBatch(data: {
    student_id: string;
    batch_id: number;
    is_active?: boolean;
    join_date?: Date;
    leave_date?: Date | null;
  }) {
    try {
      return await this.databaseService.studentBatch.create({
        data,
      });
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }

  async updateStudentBatch(id: number, data: any) {
    try {
      const existing = await this.databaseService.studentBatch.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`StudentBatch with ID ${id} not found`);
      }

      return await this.databaseService.studentBatch.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }

  async deleteStudentBatch(id: number) {
    try {
      const existing = await this.databaseService.studentBatch.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`StudentBatch with ID ${id} not found`);
      }

      await this.databaseService.studentBatch.delete({
        where: { id },
      });

      return { message: `StudentBatch with ID ${id} deleted successfully` };
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }
}
