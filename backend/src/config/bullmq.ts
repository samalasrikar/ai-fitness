import { Queue, Worker, QueueOptions, ConnectionOptions } from 'bullmq';
import { env } from '../env';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// BullMQ Configuration
// Queue implementations will occur in future phases
// ─────────────────────────────────────────────────────────────────────────────

export const bullmqConnection: ConnectionOptions = {
  host: env.QUEUE_REDIS_HOST,
  port: env.QUEUE_REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
};

export const defaultQueueOptions: QueueOptions = {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
};

// ─── Queue Name Registry ─────────────────────────────────────────────────────
// Future queue names will be registered here as the platform grows

export const QUEUE_NAMES = {
  AI_WORKOUT_GENERATION: 'ai:workout:generation',
  AI_NUTRITION_ANALYSIS: 'ai:nutrition:analysis',
  NOTIFICATION_EMAIL: 'notification:email',
  NOTIFICATION_PUSH: 'notification:push',
  PROGRESS_ANALYTICS: 'progress:analytics',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// ─── Queue Factory ───────────────────────────────────────────────────────────

export function createQueue(name: QueueName): Queue {
  const queue = new Queue(name, defaultQueueOptions);
  logger.info(`BullMQ: Queue '${name}' initialized`);
  return queue;
}

logger.info('BullMQ configuration loaded. Queue implementations pending future phases.');
