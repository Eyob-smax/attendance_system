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
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { BatchesService } from './batches.service.js';
import { CreateBatchDto } from './dto/create-batch.dto.js';
import { UpdateBatchDto } from './dto/update-batch.dto.js';
// import { BatchInterceptor } from './interceptor/batch.interceptor.js';
import { Role } from '../common/decorators/role.decorator.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { RoleGuard } from '../common/guard/role.guard.js';

@Controller('batches')
@UseGuards(AuthGuard, RoleGuard)
@Role(['super-admin'])
// @UseInterceptors(BatchInterceptor)
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
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.create(createBatchDto);
  }

  @Get()
  findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batchesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchesService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.batchesService.remove(id);
  }
}
