import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MigrateService } from './migrate.service.js';
import { CreateMigrationDTO } from './DTO/create-igration.dto.js';
import { CreateStudentBatchDto } from './DTO/create-student-batch.dto.js';
import { UpdateStudentBatchDto } from './DTO/update-student-batch.dto.js';
import { Cacheable } from '../common/decorators/cache.decorator.js';

@Controller('migrate')
export class MigrateController {
  constructor(private readonly migrateService: MigrateService) {}

  @Post()
  async migrate(@Body(ValidationPipe) createMigrationDTO: CreateMigrationDTO) {
    return await this.migrateService.migrateStudent(
      createMigrationDTO.fromBatchID,
      createMigrationDTO.toBatchID,
    );
  }

  @Cacheable()
  @Get()
  async getStudentBatch() {
    return await this.migrateService.getStudentBatchEntries();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.migrateService.getStudentBatchById(id);
  }

  @Post('create')
  async createStudentBatch(@Body(ValidationPipe) dto: CreateStudentBatchDto) {
    return await this.migrateService.createStudentBatch(dto);
  }

  @Post('update/:id')
  async updateStudentBatch(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateStudentBatchDto,
  ) {
    return await this.migrateService.updateStudentBatch(id, dto);
  }

  @Post('delete/:id')
  async deleteStudentBatch(@Param('id', ParseIntPipe) id: number) {
    return await this.migrateService.deleteStudentBatch(id);
  }
}
