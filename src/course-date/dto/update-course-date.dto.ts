import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDateDto } from './create-course-date.dto.js';

export class UpdateCourseDateDto extends PartialType(CreateCourseDateDto) {}
