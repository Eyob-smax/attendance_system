import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentBatchDto {
  @IsString()
  student_id: string;

  @IsInt()
  batch_id: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsDateString()
  join_date?: Date;

  @IsOptional()
  @IsDateString()
  leave_date?: Date | null;
}
