import { IsNumber } from 'class-validator';

export class CreateMigrationDTO {
  @IsNumber()
  fromBatchID: number;
  @IsNumber()
  toBatchID: number;
}
