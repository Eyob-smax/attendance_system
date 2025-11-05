import { Query, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service.js';

@Resolver(() => 'pet')
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Query(() => [String])
  pets() {
    return this.analyticsService.findAll();
  }
}
