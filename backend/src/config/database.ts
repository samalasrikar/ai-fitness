import { prisma } from './prisma';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// PostgreSQL Connection Health Check
// Performs a lightweight ping to verify database connectivity
// No application queries — configuration only
// ─────────────────────────────────────────────────────────────────────────────

export async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ PostgreSQL connection established successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    logger.error('Please verify your DATABASE_URL in .env and ensure PostgreSQL is running.');
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('PostgreSQL connection closed.');
}
