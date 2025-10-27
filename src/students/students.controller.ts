import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDTO } from './dto/create.dto.js';
import { UpdateStudentDto } from './dto/update.dto.js';
@Controller('student')
export class StudentsController {
  constructor(private readonly getStudentsService: StudentsService) {}

  @Get()
  async getAll() {
    return await this.getStudentsService.getAllStudents();
  }
  @Get(':student_id')
  async getOne(@Param('student_id') student_id: string) {
    return await this.getStudentsService.getStudentById(student_id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addStudent(@Body() studentDto: CreateStudentDTO) {
    return await this.getStudentsService.addStudent(studentDto);
  }

  @Patch(':student_id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async editStudent(
    @Param('student_id') student_id: string,
    @Body() updateDto: UpdateStudentDto,
  ) {
    return await this.getStudentsService.updateStudent(student_id, updateDto);
  }

  @Delete('/delete/:student_id')
  async deleteStudent(@Param('student_id') student_id: string) {
    return await this.getStudentsService.deleteStudent(student_id);
  }
}
