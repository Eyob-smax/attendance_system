import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/common/utils/types.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import {
  ethiopianToUTC,
  utcToEthiopianFormatted,
  nowInEthiopianNumerical,
} from '../common/utils/date.utils.js';

type TStudent = {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: Date | string;
  is_certified: boolean;
  current_batch_id: number;
  phone_number: string;
  department: string;
};

@Injectable()
export class StudentsService {
  private studentApi: string;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly config: ConfigService,
  ) {
    this.studentApi = this.config.get<string>('STUDENTS_API');
  }

  async fetchUsersFromExtenalApi() {
    try {
      const res = await fetch(this.studentApi);
      if (!res.ok) throw new BadRequestException('Failed to fetch data');
      const data: User[] = await res.json();

      const mappedData: TStudent[] = data.map((student: User) => ({
        student_id: student.studentid,
        first_name: student.firstname,
        last_name: student.lastname,
        email: student.useremail,
        enrollment_date: nowInEthiopianNumerical(),
        has_consented: false,
        is_certified: false,
        current_batch_id: student.universityusers.batch,
        phone_number: student.phone,
        department: student.universityusers.departmentname,
      }));

      const createdStudents = [];

      for await (const element of mappedData) {
        const result = await this.addStudent(element);
        if (result) createdStudents.push(result.createdStudent);
      }

      return {
        message: 'Students added successfully',
        createdStudents: createdStudents.map((s) =>
          this.formatStudentForEthiopian(s),
        ),
      };
    } catch (err) {
      console.error('Error fetching students:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  async addStudent(student: TStudent) {
    const {
      current_batch_id,
      email,
      first_name,
      is_certified,
      last_name,
      student_id,
      phone_number,
      enrollment_date,
      department,
    } = student;

    if (!student_id || !first_name || !current_batch_id) {
      throw new BadRequestException('Some fields are required!');
    }

    try {
      const existingStudent = await this.databaseService.student.findUnique({
        where: { student_id },
      });

      if (existingStudent) {
        throw new BadRequestException(
          `Student with ${student_id} already created!`,
        );
      }

      const createdStudent = await this.databaseService.student.create({
        data: {
          student_id,
          email,
          first_name,
          last_name,
          is_certified,
          current_batch_id,
          enrollment_date: ethiopianToUTC(enrollment_date as string),
          phone_number,
          department,
        },
      });

      return {
        createdStudent: this.formatStudentForEthiopian(createdStudent),
        message: 'Created student',
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async getAllStudents() {
    try {
      const students = await this.databaseService.student.findMany({
        orderBy: { enrollment_date: 'desc' },
        include: {
          attendances: {
            omit: {
              student_id: true,
              attendance_id: true,
            },
            include: {
              course_date: {
                include: { course: true, batch: true },
              },
            },
          },
          current_batch: true,
        },
      });
      return students.map((s) => this.formatStudentForEthiopian(s));
    } catch (err) {
      console.error('Error fetching students:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  async getStudentById(student_id: string) {
    try {
      const student = await this.databaseService.student.findUnique({
        where: { student_id },
        include: {
          attendances: true,
          current_batch: true,
        },
      });

      if (!student) throw new NotFoundException('Student not found');
      return this.formatStudentForEthiopian(student);
    } catch (err) {
      console.error('Error fetching student:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  async updateStudent(student_id: string, updates: Partial<TStudent>) {
    try {
      const existing = await this.databaseService.student.findUnique({
        where: { student_id },
      });
      if (!existing) throw new NotFoundException('Student not found');

      const data = { ...updates };
      if (updates.enrollment_date) {
        data.enrollment_date = ethiopianToUTC(
          updates.enrollment_date as string,
        );
      }

      const updatedStudent = await this.databaseService.student.update({
        where: { student_id },
        data,
      });

      return {
        updatedStudent: this.formatStudentForEthiopian(updatedStudent),
        message: 'Student updated successfully',
      };
    } catch (err) {
      console.error('Error updating student:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  async deleteStudent(student_id: string) {
    try {
      const existing = await this.databaseService.student.findUnique({
        where: { student_id },
      });
      if (!existing) throw new NotFoundException('Student not found');

      await this.databaseService.student.delete({
        where: { student_id },
      });

      return { message: 'Student deleted successfully' };
    } catch (err) {
      console.error('Error deleting student:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  private formatStudentForEthiopian(student: any) {
    const formatted = {
      ...student,
      enrollment_date: utcToEthiopianFormatted(student.enrollment_date),
    };

    if (student.attendances) {
      formatted.attendances = student.attendances.map((a: any) => ({
        ...a,
        recorded_at: utcToEthiopianFormatted(a.recorded_at),
        course_date: {
          ...a.course_date,
          class_date: utcToEthiopianFormatted(a.course_date.class_date),
          batch: a.course_date.batch
            ? {
                ...a.course_date.batch,
                start_date: utcToEthiopianFormatted(
                  a.course_date.batch.start_date,
                ),
                end_date: a.course_date.batch.end_date
                  ? utcToEthiopianFormatted(a.course_date.batch.end_date)
                  : null,
              }
            : null,
        },
      }));
    }

    if (student.current_batch) {
      formatted.current_batch = {
        ...student.current_batch,
        start_date: utcToEthiopianFormatted(student.current_batch.start_date),
        end_date: student.current_batch.end_date
          ? utcToEthiopianFormatted(student.current_batch.end_date)
          : null,
      };
    }

    return formatted;
  }
}
