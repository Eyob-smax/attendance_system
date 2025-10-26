import { IsBoolean, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean()
  is_present: boolean;
  @IsString()
  student_id: string;
  @IsPositive()
  date_id: number;
  @IsOptional()
  @IsPositive()
  recorded_by_user_id: number;
}
