import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisCacheService } from '@app/common/redis/redis-cache.service';
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: 'redis://default:password@localhost:6379/0',
        }),
        isGlobal: true,
      }),
      isGlobal: true,
      imports: undefined,
      useClass: undefined,
      useExisting: undefined,
      inject: [],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule {}
