import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, ServerOptions } from 'socket.io';
import { env } from '../env';
import { logger } from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// Socket.IO Configuration
// Event handlers and room implementations will occur in future phases
// ─────────────────────────────────────────────────────────────────────────────

let io: SocketIOServer | null = null;

const socketOptions: Partial<ServerOptions> = {
  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
};

export function initializeSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, socketOptions);

  io.on('connection', (socket) => {
    logger.info(`Socket.IO: Client connected [id=${socket.id}]`);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket.IO: Client disconnected [id=${socket.id}] reason=${reason}`);
    });
  });

  logger.info('✅ Socket.IO initialized. Event implementations pending future phases.');
  return io;
}

export function getSocketIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocket() first.');
  }
  return io;
}
