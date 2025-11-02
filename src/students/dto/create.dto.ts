import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

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
  enrollment_date: Date;
  @IsBoolean()
  has_consented: boolean;
  @IsBoolean()
  is_certified: boolean;
  @IsNumber()
  current_batch_id: number;
  @IsString()
  @IsString()
  phone_number: string;
}
