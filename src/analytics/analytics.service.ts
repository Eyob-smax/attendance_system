import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  findAll() {
    return ['pet1', 'pet2', 'pet3'];
  }
}
