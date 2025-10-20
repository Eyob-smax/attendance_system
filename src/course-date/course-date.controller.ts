import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CourseDateService } from './course-date.service.js';
import { CreateCourseDateDto } from './dto/create-course-date.dto.js';
import { UpdateCourseDateDto } from './dto/update-course-date.dto.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Role } from '../common/decorators/role.decorator.js';

@Controller('course_date')
@UseGuards(AuthGuard, RoleGuard)
@Role(['super-admin'])
export class CourseDateController {
  constructor(private readonly courseDateService: CourseDateService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  create(@Body() createCourseDateDto: CreateCourseDateDto) {
    return this.courseDateService.create(createCourseDateDto);
  }

  @Get()
  findAll() {
    return this.courseDateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseDateService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDateDto: UpdateCourseDateDto,
  ) {
    return this.courseDateService.update(id, updateCourseDateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseDateService.remove(id);
  }
}
