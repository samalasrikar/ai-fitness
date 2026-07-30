import { Server as HttpServer } from 'http';
import * as socketio from 'socket.io';
import { env } from '../env';
import { logger } from './logger';

let io: any = null;

export function initializeSocket(httpServer: HttpServer): any {
  const ServerClass = (socketio as any).Server || socketio;
  io = new ServerClass(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: any) => {
    logger.info(`Socket.IO: Client connected [id=${socket.id}]`);

    socket.on('disconnect', (reason: string) => {
      logger.info(`Socket.IO: Client disconnected [id=${socket.id}] reason=${reason}`);
    });
  });

  logger.info('✅ Socket.IO initialized.');
  return io;
}

export function getSocketIO(): any {
  if (!io) {
    throw new Error('Socket.IO has not been initialized.');
  }
  return io;
}
