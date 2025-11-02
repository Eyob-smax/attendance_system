// create-batch.dto.ts
import { IsString, Matches } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  batch_name: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'start_date must be in Ethiopian format: YYYY-MM-DD (e.g., 2018-02-23)',
  })
  start_date: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'end_date must be YYYY-MM-DD' })
  end_date?: string;

  is_completed?: boolean;
}
