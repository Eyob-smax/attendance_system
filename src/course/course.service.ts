import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';

@Injectable()
export class CourseService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCourseDto: CreateCourseDto) {
    if (!createCourseDto.course_name) {
      throw new BadRequestException('Course name is required!');
    }

    try {
      const course = await this.databaseService.course.create({
        data: createCourseDto,
      });
      return {
        course,
        message: 'Course created successfully',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const courses = await this.databaseService.course.findMany();
      return {
        courses,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    try {
      const course = await this.databaseService.course.findUnique({
        where: { course_id: id },
      });
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return {
        course,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.databaseService.course.update({
        where: { course_id: id },
        data: updateCourseDto,
      });
      return {
        course,
        message: 'Course updated successfully',
      };
    } catch (err) {
      if (err instanceof Error && (err as any).code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  async remove(id: number) {
    try {
      const course = await this.databaseService.course.delete({
        where: { course_id: id },
      });
      return {
        course,
        message: 'Course deleted successfully',
      };
    } catch (err) {
      if (err instanceof Error && (err as any).code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw mapPrismaErrorToHttp(err);
    }
  }
}
