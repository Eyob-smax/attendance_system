import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  student_id: string;
  @IsString()
  password: string;
  @IsString()
  role: string;
  @IsEmail()
  email: string;
}
