import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { ConfigService } from '@nestjs/config';
import { UniversityUser, User } from 'src/common/utils/types.js';

type TStudent = {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: Date;
  has_consented: boolean;
  is_certified: boolean;
  current_batch_id: number;
  phone_number: string;
};

@Injectable()
export class GetStudentsService {
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
        enrollment_date: new Date(),
        has_consented: false,
        is_certified: false,
        current_batch_id: student.universityusers.batch,
        phone_number: student.phone,
      }));

      const createdStudents = [];

      for await (const element of mappedData) {
        const result = await this.addStudent(element);
        if (result) createdStudents.push(result.createdStudent);
      }

      return {
        message: 'Students added successfully',
        createdStudents,
      };
    } catch (err) {
      console.error('Error fetching students:', err);
      throw new BadRequestException('Failed to fetch or add students');
    }
  }

  async addStudent(student: TStudent) {
    const {
      current_batch_id,
      email,
      first_name,
      has_consented,
      is_certified,
      last_name,
      student_id,
      phone_number,
      enrollment_date,
    } = student;

    if (!student_id || !first_name || !current_batch_id) {
      throw new BadRequestException('Some fields are required!');
    }

    try {
      const existingStudent = await this.databaseService.student.findUnique({
        where: { student_id },
      });

      if (existingStudent) return;

      const createdStudent = await this.databaseService.student.create({
        data: {
          student_id,
          email,
          first_name,
          last_name,
          is_certified,
          current_batch_id,
          enrollment_date,
          phone_number,
          has_consented,
        },
      });

      return { createdStudent, message: 'Created student' };
    } catch (err) {
      console.error('Error adding student:', err);
      throw new BadRequestException('Error adding student');
    }
  }

  async getAllStudents() {
    try {
      return await this.databaseService.student.findMany({
        orderBy: { enrollment_date: 'desc' },
      });
    } catch (err) {
      console.error('Error fetching students:', err);
      throw new BadRequestException('Error fetching students');
    }
  }

  async getStudentById(student_id: string) {
    try {
      const student = await this.databaseService.student.findUnique({
        where: { student_id },
      });

      if (!student) throw new NotFoundException('Student not found');
      return student;
    } catch (err) {
      console.error('Error fetching student:', err);
      throw new BadRequestException('Error fetching student');
    }
  }

  // 🔹 Update
  async updateStudent(student_id: string, updates: Partial<TStudent>) {
    try {
      const existing = await this.databaseService.student.findUnique({
        where: { student_id },
      });
      if (!existing) throw new NotFoundException('Student not found');

      const updatedStudent = await this.databaseService.student.update({
        where: { student_id },
        data: updates,
      });

      return { updatedStudent, message: 'Student updated successfully' };
    } catch (err) {
      console.error('Error updating student:', err);
      throw new BadRequestException('Error updating student');
    }
  }

  // 🔹 Delete
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
      throw new BadRequestException('Error deleting student');
    }
  }
}
