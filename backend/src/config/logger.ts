import winston from 'winston';
import path from 'path';
import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// Winston Logger Configuration
// ─────────────────────────────────────────────────────────────────────────────

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom development log format
const devFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `${ts} [${level}]: ${stack ?? message}${metaStr}`;
});

// Transports
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      devFormat,
    ),
  }),
];

// Add file transports in production
if (env.IS_PRODUCTION) {
  transports.push(
    new winston.transports.File({
      filename: path.join(env.LOG_FILE_PATH, 'error.log'),
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: path.join(env.LOG_FILE_PATH, 'combined.log'),
      format: combine(timestamp(), json()),
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  defaultMeta: { service: 'fitaix-api' },
  transports,
  exitOnError: false,
});
