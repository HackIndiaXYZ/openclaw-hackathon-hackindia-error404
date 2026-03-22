import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (typeof window === 'undefined') {
    return { 
      on: () => {}, 
      off: () => {}, 
      emit: () => {}, 
      connected: false,
      connect: () => {},
      disconnect: () => {}
    } as any;
  }
  if (!socketInstance) {
    socketInstance = io(process.env.NEXT_PUBLIC_API_URL_ROOT || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true
    });
  }
  return socketInstance;
};

export const socket = typeof window !== 'undefined' ? getSocket() : { 
  on: () => {}, 
  off: () => {}, 
  emit: () => {}, 
  connected: false,
  connect: () => {},
  disconnect: () => {}
} as any;
