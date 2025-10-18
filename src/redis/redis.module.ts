import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
@Global()
@Module({
  exports: ['REDIS_CLIENT'],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        try {
          const redisClient = createClient({ url: 'redis://localhost:6379' });
          await redisClient.connect();
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
