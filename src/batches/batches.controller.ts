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
import { BatchesService } from './batches.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';
import { Role } from '../common/decorators/role.decorator.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { RoleGuard } from '../common/guard/role.guard.js';

@Controller('batches')
@UseGuards(AuthGuard, RoleGuard)
@Role(['super-admin'])
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  async create(@Body() createBatchDto: CreateBatchDto) {
    return await this.batchesService.create(createBatchDto);
  }

  @Get()
  async findAll() {
    return await this.batchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.batchesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return await this.batchesService.update(id, updateBatchDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.batchesService.remove(id);
  }
}
