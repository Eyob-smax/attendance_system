import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateCourseDateDto } from './dto/create-course-date.dto.js';
import { UpdateCourseDateDto } from './dto/update-course-date.dto.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import {
  ethiopianToUTC,
  utcToEthiopianFormatted,
  formatTimeInET,
} from '../common/utils/date.utils.js';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class CourseDateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCourseDateDto: CreateCourseDateDto) {
    const { class_date, start_time, course_id, batch_id } = createCourseDateDto;

    if (!class_date || !course_id || !batch_id) {
      throw new BadRequestException(
        'class_date (Ethiopian YYYY-MM-DD), course_id, and batch_id are required!',
      );
    }

    try {
      const data: Prisma.CourseDateCreateInput = {
        class_date: ethiopianToUTC(class_date),
        start_time: start_time
          ? DateTime.fromFormat(start_time, 'HH:mm', {
              zone: 'Africa/Addis_Ababa',
            })
              .toUTC()
              .toJSDate()
          : null,
        course: { connect: { course_id: Number(course_id) } },
        batch: { connect: { batch_id: Number(batch_id) } },
      };

      const courseDate = await this.databaseService.courseDate.create({ data });

      return {
        courseDate: this.formatCourseDateForEthiopian(courseDate),
        message: 'Course date created successfully',
      };
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BadRequestException(
          'A class already exists for this batch, course, and date.',
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

      return {
        courseDates: courseDates.map((cd) =>
          this.formatCourseDateForEthiopian(cd),
        ),
        message: 'Course dates retrieved successfully',
      };
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

      return {
        courseDate: this.formatCourseDateForEthiopian(courseDate),
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateCourseDateDto: UpdateCourseDateDto) {
    try {
      const data: Prisma.CourseDateUpdateInput = { ...updateCourseDateDto };

      if (updateCourseDateDto.class_date) {
        data.class_date = ethiopianToUTC(updateCourseDateDto.class_date);
      }

      if (updateCourseDateDto.start_time !== undefined) {
        data.start_time = updateCourseDateDto.start_time
          ? DateTime.fromFormat(updateCourseDateDto.start_time, 'HH:mm', {
              zone: 'Africa/Addis_Ababa',
            })
              .toUTC()
              .toJSDate()
          : null;
      }

      const courseDate = await this.databaseService.courseDate.update({
        where: { date_id: id },
        data,
      });

      return {
        courseDate: this.formatCourseDateForEthiopian(courseDate),
        message: 'Course date updated successfully',
      };
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException(`Course date with ID ${id} not found`);
      }
      if (err?.code === 'P2002') {
        throw new BadRequestException(
          'A class already exists for this batch, course, and date.',
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

      return {
        courseDate: this.formatCourseDateForEthiopian(courseDate),
        message: 'Course date deleted successfully',
      };
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException(`Course date with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  private formatCourseDateForEthiopian(courseDate: any) {
    return {
      ...courseDate,
      class_date: utcToEthiopianFormatted(courseDate.class_date),
      start_time: formatTimeInET(courseDate.start_time),
      course: courseDate.course
        ? {
            ...courseDate.course,
          }
        : null,
      batch: courseDate.batch
        ? {
            ...courseDate.batch,
            start_date: utcToEthiopianFormatted(courseDate.batch.start_date),
            end_date: courseDate.batch.end_date
              ? utcToEthiopianFormatted(courseDate.batch.end_date)
              : null,
          }
        : null,
    };
  }
}
