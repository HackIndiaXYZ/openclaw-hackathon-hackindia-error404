import { Server } from 'socket.io';
import { createServer } from 'http';

let io: Server;

export function initSocket(httpServer: ReturnType<typeof createServer>) {
  io = new Server(httpServer, {
    cors: { origin: '*' }
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(httpServer) first.');
  }
  return io;
}
