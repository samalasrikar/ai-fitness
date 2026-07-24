import http from 'http';
import { createApp } from './app';
import { env } from './env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';
import { checkDatabaseConnection } from './config/database';
import { initializeSocket } from './config/socket';

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap Function
// ─────────────────────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  try {
    // 1. Create Express application
    const app = createApp();

    // 2. Create HTTP server
    const httpServer = http.createServer(app);

    // 3. Initialize Socket.IO (configuration only)
    initializeSocket(httpServer);

    // 4. Check PostgreSQL connection
    await checkDatabaseConnection();

    // 5. Start listening
    httpServer.listen(env.PORT, () => {
      logger.info(`🚀 FitAI X API Server started`, {
        environment: env.NODE_ENV,
        port: env.PORT,
        apiPrefix: env.API_PREFIX,
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      });
    });

    // 6. Graceful shutdown handlers
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      httpServer.close(async () => {
        logger.info('HTTP server closed.');

        await prisma.$disconnect();
        logger.info('Database connection closed.');

        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Unhandled Rejection / Exception Guards
// ─────────────────────────────────────────────────────────────────────────────

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
