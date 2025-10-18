import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto.js';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
