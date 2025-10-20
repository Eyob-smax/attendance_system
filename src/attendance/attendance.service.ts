import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';

@Injectable()
export class AttendanceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    try {
      if (!createAttendanceDto.is_present || !createAttendanceDto.student_id) {
        throw new BadRequestException(
          'Required fields missing: is_present and student_id!',
        );
      }

      const createdAttendance = await this.databaseService.attendance.create({
        data: createAttendanceDto,
      });

      return {
        attendance: createdAttendance,
        message: 'Attendance created successfully!',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const attendanceRecords =
        await this.databaseService.attendance.findMany();

      return {
        attendanceRecords,
        message: 'All attendance records retrieved successfully!',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    try {
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid ID provided.');
      }

      const attendance = await this.databaseService.attendance.findUnique({
        where: { attendance_id: id },
      });

      if (!attendance) {
        throw mapPrismaErrorToHttp({ code: 'P2025' });
      }

      return {
        attendance,
        message: `Attendance record #${id} retrieved successfully!`,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid ID provided.');
      }

      if (Object.keys(updateAttendanceDto).length === 0) {
        throw new BadRequestException(
          'At least one field must be provided for update.',
        );
      }

      const updatedAttendance = await this.databaseService.attendance.update({
        where: { attendance_id: id },
        data: updateAttendanceDto,
      });

      return {
        attendance: updatedAttendance,
        message: `Attendance record #${id} updated successfully!`,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async remove(id: number) {
    try {
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid ID provided.');
      }

      const removedAttendance = await this.databaseService.attendance.delete({
        where: { attendance_id: id },
      });

      return {
        attendance: removedAttendance,
        message: `Attendance record #${id} removed successfully!`,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }
}
