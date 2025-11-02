import { IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCourseDateDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'class_date must be in Ethiopian format: YYYY-MM-DD (e.g., 2018-02-23)',
  })
  class_date: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_time must be in HH:mm format (24-hour, e.g., 09:30)',
  })
  start_time?: string;

  @IsInt()
  course_id: number;

  @IsInt()
  batch_id: number;
}
