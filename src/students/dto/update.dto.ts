import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDTO } from './create.dto.js';
export class UpdateStudentDto extends PartialType(CreateStudentDTO) {}
