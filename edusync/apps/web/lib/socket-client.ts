import { io, Socket } from 'socket.io-client';

let socketInstance: Socket;

export const getSocket = (): Socket => {
  if (typeof window === 'undefined') {
    return { 
      connected: false, 
      on: () => {}, 
      off: () => {}, 
      emit: () => {}, 
      connect: () => {},
      disconnect: () => {}
    } as any;
  }

  if (!socketInstance) {
    socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      console.log('✨ Web: Connected to Nexus Socket Hub');
    });
  }
  return socketInstance;
};

export const socket = typeof window !== 'undefined' ? getSocket() : (null as any);
