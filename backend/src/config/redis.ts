import Redis from 'ioredis';
import { env } from '../env';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// Redis Client Configuration
// Implementation of caching/pub-sub will occur in future phases
// ─────────────────────────────────────────────────────────────────────────────

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number): number | null => {
    if (times > 3) {
      logger.warn('Redis: Maximum reconnection attempts reached. Giving up.');
      return null; // Stop retrying
    }
    const delay = Math.min(times * 200, 2000);
    logger.warn(`Redis: Reconnecting in ${delay}ms (attempt ${times})...`);
    return delay;
  },
  lazyConnect: true, // Don't connect until explicitly called
  enableOfflineQueue: false,
};

// Singleton Redis client
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(redisOptions);

    redisClient.on('connect', () => {
      logger.info('✅ Redis connection established');
    });

    redisClient.on('error', (error: Error) => {
      logger.error('Redis connection error:', error.message);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });
  }

  return redisClient;
}

export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  await client.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed gracefully.');
  }
}
