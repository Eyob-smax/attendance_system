import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  student_id: string;
  @IsString()
  password: string;
}
