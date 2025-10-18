import { IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  course_name: string;
  @IsString()
  @IsOptional()
  description: string;
}
