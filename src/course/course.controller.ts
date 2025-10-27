import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Role } from '../common/decorators/role.decorator.js';

@Controller('course')
@UseGuards(AuthGuard, RoleGuard)
@Role(['super-admin'])
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.remove(id);
  }
}
