import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';

@Injectable()
export class BatchesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBatchDto: CreateBatchDto) {
    if (!createBatchDto.batch_name || !createBatchDto.start_date) {
      throw new BadRequestException('Batch name is required!');
    }

    try {
      const batch = await this.databaseService.batch.create({
        data: {
          batch_name: createBatchDto.batch_name,
          start_date: new Date(createBatchDto.start_date),
          end_date: createBatchDto.end_date
            ? new Date(createBatchDto.end_date)
            : null,
          is_completed: createBatchDto.is_completed,
        },
      });

      return {
        batch,
        message: 'Batch created successfully',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const batches = await this.databaseService.batch.findMany({
        include: { course_dates: true, students: true },
      });
      return {
        batches,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    try {
      const batch = await this.databaseService.batch.findUnique({
        where: { batch_id: id },
        include: { course_dates: true, students: true },
      });

      if (!batch) {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }

      return {
        batch,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    try {
      const batch = await this.databaseService.batch.update({
        where: { batch_id: id },
        data: {
          ...updateBatchDto,
          start_date: updateBatchDto.start_date
            ? new Date(updateBatchDto.start_date)
            : undefined,
          end_date: updateBatchDto.end_date
            ? new Date(updateBatchDto.end_date)
            : undefined,
        },
      });

      return {
        batch,
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
        batch,
        message: 'Batch deleted successfully',
      };
    } catch (err) {
      if ((err as any)?.code === 'P2025') {
        throw new NotFoundException(`Batch with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }
}
