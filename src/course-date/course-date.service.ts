import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateCourseDateDto } from './dto/create-course-date.dto.js';
import { UpdateCourseDateDto } from './dto/update-course-date.dto.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';

@Injectable()
export class CourseDateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCourseDateDto: CreateCourseDateDto) {
    const { class_date, start_time, course_id, batch_id } = createCourseDateDto;

    if (!class_date || !course_id || !batch_id) {
      throw new BadRequestException(
        'class_date, course_id, and batch_id are required!',
      );
    }

    try {
      const courseDate = await this.databaseService.courseDate.create({
        data: {
          class_date: new Date(class_date),
          start_time: start_time ? new Date(`1970-01-01T${start_time}`) : null,
          course: { connect: { course_id: Number(course_id) } },
          batch: { connect: { batch_id: Number(batch_id) } },
        },
      });

      return { courseDate };
    } catch (err) {
      if ((err as any)?.code === 'P2002') {
        throw new BadRequestException(
          'A course date for this batch and course already exists on the specified date',
        );
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const courseDates = await this.databaseService.courseDate.findMany({
        include: { course: true, batch: true },
      });
      return { courseDates, message: 'Course dates retrieved successfully' };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    try {
      const courseDate = await this.databaseService.courseDate.findUnique({
        where: { date_id: id },
        include: { course: true, batch: true },
      });

      if (!courseDate) {
        throw new NotFoundException(`Course date with ID ${id} not found`);
      }

      return { courseDate };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateCourseDateDto: UpdateCourseDateDto) {
    try {
      const courseDate = await this.databaseService.courseDate.update({
        where: { date_id: id },
        data: {
          ...updateCourseDateDto,
          class_date: updateCourseDateDto.class_date
            ? new Date(updateCourseDateDto.class_date)
            : undefined,
          start_time: updateCourseDateDto.start_time
            ? new Date(`1970-01-01T${updateCourseDateDto.start_time}`)
            : undefined,
        },
      });

      return { courseDate, message: 'Course date updated successfully' };
    } catch (err) {
      if ((err as any)?.code === 'P2025') {
        throw new NotFoundException(`Course date with ID ${id} not found`);
      }
      if ((err as any)?.code === 'P2002') {
        throw new BadRequestException(
          'A course date for this batch and course already exists on the specified date',
        );
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  async remove(id: number) {
    try {
      const courseDate = await this.databaseService.courseDate.delete({
        where: { date_id: id },
      });

      return { courseDate, message: 'Course date deleted successfully' };
    } catch (err) {
      if ((err as any)?.code === 'P2025') {
        throw new NotFoundException(`Course date with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }
}
