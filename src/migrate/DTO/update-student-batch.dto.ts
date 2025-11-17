import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateStudentBatchDto {
  @IsOptional()
  @IsString()
  student_id?: string;

  @IsOptional()
  @IsInt()
  batch_id?: number;

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
