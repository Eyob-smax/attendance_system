import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDTO {
  @IsString()
  student_id: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  department: string;
  @IsString()
  email: string;
  @IsDateString()
  enrollment_date: string;
  @IsBoolean()
  @IsOptional()
  is_certified: boolean;
  @IsNumber()
  current_batch_id: number;
  @IsString()
  phone_number: string;
}
