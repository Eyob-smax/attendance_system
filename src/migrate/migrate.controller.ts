import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { MigrateService } from './migrate.service.js';
import { CreateMigrationDTO } from './DTO/create-igration.dto.js';

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
}
