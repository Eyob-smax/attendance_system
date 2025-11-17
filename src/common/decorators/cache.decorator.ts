import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'USE_CACHE';
export const Cacheable = () => SetMetadata(CACHE_KEY, true);
