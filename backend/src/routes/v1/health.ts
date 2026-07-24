import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { prisma } from '../../config/prisma';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint verifying service availability and PostgreSQL connection
 */
router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'error';
  }

  res.status(200).json(
    ApiResponse.success('FitAI X API Service Healthy', {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
      },
    }),
  );
});

export const healthRouter = router;
