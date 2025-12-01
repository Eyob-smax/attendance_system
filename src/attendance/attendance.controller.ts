import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Role } from '../common/decorators/role.decorator.js';
import { Cacheable } from '../common/decorators/cache.decorator.js';

@Controller('attendance')
@UseGuards(AuthGuard, RoleGuard)
@Role(['super-admin', 'admin'])
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createAttendanceDto: CreateAttendanceDto,
  ) {
    return await this.attendanceService.create(createAttendanceDto);
  }
  @Cacheable()
  @Get()
  async findAll() {
    return await this.attendanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.attendanceService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return await this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.attendanceService.remove(id);
  }
}
