import { IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean()
  is_present: boolean;
  @IsPositive()
  student_id: number;
  @IsPositive()
  date_id: number;
  @IsOptional()
  @IsPositive()
  recorded_by_user_id: number;
}
