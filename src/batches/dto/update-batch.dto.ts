import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchDto } from './create-batch.dto.js';

export class UpdateBatchDto extends PartialType(CreateBatchDto) {}
