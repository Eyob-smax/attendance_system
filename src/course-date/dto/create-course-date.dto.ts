import { IsDecimal, IsPositive, IsString } from 'class-validator';

export class CreateCourseDateDto {
  @IsString()
  class_date: string;
  @IsString()
  start_time: string;
  @IsPositive()
  course_id: number;
  @IsPositive()
  batch_id: number;
}
