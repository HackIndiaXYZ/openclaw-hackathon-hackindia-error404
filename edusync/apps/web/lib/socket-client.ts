import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    });
    
    // Auto-join personal room on connect if user is authenticated
    // Note: In a real app, you'd pass the UID from the session hook
    socket.on('connect', () => {
      console.log('⚡ Connected to Nexus Socket Hub');
    });
  }
  return socket;
};
