import { io } from 'socket.io-client';

// Use empty string to let the Vite proxy handle it, or use the explicit backend URL
const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
});

export const authenticateSocket = (token: string) => {
  socket.emit('authenticate', token);
};
