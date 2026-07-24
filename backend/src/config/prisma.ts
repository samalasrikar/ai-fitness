import { PrismaClient } from '@prisma/client';
import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// Prisma Client Singleton
// Prevents multiple instances during hot-reload in development
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma ?? new PrismaClient({
  log: env.IS_DEVELOPMENT
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
  errorFormat: 'colorless',
});

if (env.IS_DEVELOPMENT) {
  globalThis.__prisma = prisma;
}
