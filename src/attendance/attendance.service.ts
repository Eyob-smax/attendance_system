import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';

@Injectable()
export class AttendanceService {
  constructor(private readonly databaseService: DatabaseService) {}

  private serializeAttendance(attendance: any) {
    if (!attendance) return attendance;
    return {
      ...attendance,
      attendance_id: attendance.attendance_id.toString(),
      student_id:
        typeof attendance.student_id === 'bigint'
          ? attendance.student_id.toString()
          : attendance.student_id,
    };
  }

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
        attendance: this.serializeAttendance(createdAttendance),
        message: 'Attendance created successfully!',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findAll() {
    try {
      const attendanceRecords = await this.databaseService.attendance.findMany({
        include: {
          course_date: {
            include: { course: true, batch: true },
          },
          student: true,
        },
      });

      return {
        attendanceRecords: attendanceRecords.map((rec) =>
          this.serializeAttendance(rec),
        ),
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
        where: { attendance_id: BigInt(id) },
        include: { course_date: true, student: true },
      });

      if (!attendance) {
        console.log('Attendance record not found for ID:', id);
        throw new NotFoundException(
          'Attendance record not found with the given ID.',
        );
      }

      return {
        attendance: this.serializeAttendance(attendance),
        message: `Attendance record #${id} retrieved successfully!`,
      };
    } catch (err) {
      console.log(err);
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
        where: { attendance_id: BigInt(id) },
        data: updateAttendanceDto,
      });

      return {
        attendance: this.serializeAttendance(updatedAttendance),
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
        where: { attendance_id: BigInt(id) },
      });

      return {
        attendance: this.serializeAttendance(removedAttendance),
        message: `Attendance record #${id} removed successfully!`,
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }
}
