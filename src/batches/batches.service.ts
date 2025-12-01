import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import {
  ethiopianToUTC,
  utcToEthiopianFormatted,
  formatTimeInET,
} from '../common/utils/date.utils.js';
import { Prisma } from '../../prisma/generated/client/client.js';

@Injectable()
export class BatchesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBatchDto: CreateBatchDto) {
    if (!createBatchDto.batch_name || !createBatchDto.start_date) {
      throw new BadRequestException(
        'Batch name and start_date (Ethiopian YYYY-MM-DD) are required!',
      );
    }

    try {
      const data: Prisma.BatchCreateInput = {
        batch_name: createBatchDto.batch_name,
        start_date: ethiopianToUTC(createBatchDto.start_date),
        end_date: createBatchDto.end_date
          ? ethiopianToUTC(createBatchDto.end_date)
          : null,
        is_completed: createBatchDto.is_completed ?? false,
      };

      const batch = await this.databaseService.batch.create({ data });

      return {
        batch: this.formatBatchForEthiopian(batch),
        message: 'Batch created successfully',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const batches = await this.databaseService.batch.findMany({
        include: {
          course_dates: true,
          students: true,
        },
      });

      return {
        batches: batches.map((b) => this.formatBatchForEthiopian(b)),
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    try {
      const batch = await this.databaseService.batch.findUnique({
        where: { batch_id: id },
        include: {
          course_dates: true,
          students: true,
        },
      });

      if (!batch) {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }

      return {
        batch: this.formatBatchForEthiopian(batch),
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    try {
      const data: Prisma.BatchUpdateInput = { ...updateBatchDto };

      if (updateBatchDto.start_date) {
        data.start_date = ethiopianToUTC(updateBatchDto.start_date);
      }

      if (updateBatchDto.end_date !== undefined) {
        data.end_date = updateBatchDto.end_date
          ? ethiopianToUTC(updateBatchDto.end_date)
          : null;
      }

      const batch = await this.databaseService.batch.update({
        where: { batch_id: id },
        data,
      });

      return {
        batch: this.formatBatchForEthiopian(batch),
        message: 'Batch updated successfully',
      };
    } catch (err) {
      if ((err as any)?.code === 'P2025') {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  async remove(id: number) {
    try {
      const batch = await this.databaseService.batch.delete({
        where: { batch_id: id },
      });

      return {
        batch: this.formatBatchForEthiopian(batch),
        message: 'Batch deleted successfully',
      };
    } catch (err) {
      if ((err as any)?.code === 'P2025') {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  // private async enrollStudentInBatch(
  //   studentId: string,
  //   batchId: number,
  //   joinDate = new Date(),
  // ) {
  //   await this.databaseService.studentBatch.updateMany({
  //     where: { student_id: studentId, is_active: true },
  //     data: { is_active: false, leave_date: joinDate },
  //   });

  //   const sb = await this.databaseService.studentBatch.create({
  //     data: {
  //       student_id: studentId,
  //       batch_id: batchId,
  //       join_date: joinDate,
  //       is_active: true,
  //     },
  //   });

  //   await this.databaseService.student.update({
  //     where: { student_id: studentId },
  //     data: { current_batch_id: batchId },
  //   });

  //   return sb;
  // }

  private formatBatchForEthiopian(batch: any) {
    const formatted: any = {
      ...batch,
      start_date: utcToEthiopianFormatted(batch.start_date),
      end_date: batch.end_date ? utcToEthiopianFormatted(batch.end_date) : null,
    };

    if (batch.course_dates) {
      formatted.course_dates = batch.course_dates.map((cd: any) => ({
        ...cd,
        class_date: utcToEthiopianFormatted(cd.class_date),
        start_time: formatTimeInET(cd.start_time),
      }));
    }

    return formatted;
  }
}
