import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './env';
import { corsOptions } from './config/cors';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

// ─────────────────────────────────────────────────────────────────────────────
// Application Factory
// ─────────────────────────────────────────────────────────────────────────────

export function createApp(): Application {
  const app: Application = express();

  // ── Security & Request ID Middleware ────────────────────────────────────
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors(corsOptions));

  // ── Body Parsing & Cookies ───────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // ── Request Logging ──────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── API Routes ───────────────────────────────────────────────────────────
  app.use(env.API_PREFIX, apiRouter);

  // ── 404 Handler ──────────────────────────────────────────────────────────
  app.use(notFound);

  // ── Global Error Handler ─────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
