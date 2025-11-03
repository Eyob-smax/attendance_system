import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { CreateAnalyticsDto } from './dto/create-analytics.dto.js';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  create(@Body() createAnalyticsDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createAnalyticsDto);
  }

  @Get()
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnalyticsDto: UpdateAnalyticsDto,
  ) {
    return this.analyticsService.update(+id, updateAnalyticsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analyticsService.remove(+id);
  }
}
