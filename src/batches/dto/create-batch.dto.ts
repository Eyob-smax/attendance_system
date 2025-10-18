import { IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  batch_name: string;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsBoolean()
  is_completed: boolean;
}
