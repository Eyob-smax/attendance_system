import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
@Global()
@Module({
  exports: ['REDIS_CLIENT'],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        try {
          const redisClient = createClient({
            url: config.get<string>('REDIS_URL'),
          });
          await redisClient.connect();
          console.log('✅ Connected to Redis successfully!');
          return redisClient;
        } catch (err) {
          console.error("Can't connect with the DB! " + err.message);
          throw new Error("Can't connect to REDIS ! ");
        }
      },
    },
  ],
})
export class RedisModule {}
