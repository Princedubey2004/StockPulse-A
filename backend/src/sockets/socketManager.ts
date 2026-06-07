import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

let io: Server;

export function initSocketManager(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Enable Redis adapter for scaling across multiple Node instances
  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Client authenticates to join private room
    socket.on('authenticate', (token: string) => {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
        socket.join(`user:${decoded.id}`);
        console.log(`[Socket.io] ${socket.id} authenticated and joined user:${decoded.id}`);
      } catch (err) {
        console.error(`[Socket.io] Authentication failed for ${socket.id}`);
      }
    });

    // Client subscribes to specific stock symbols
    socket.on('subscribe_stock', (symbol: string) => {
      console.log(`[Socket.io] ${socket.id} subscribed to ${symbol}`);
      socket.join(`stock:${symbol}`);
    });

    // Client unsubscribes from specific stock symbols
    socket.on('unsubscribe_stock', (symbol: string) => {
      console.log(`[Socket.io] ${socket.id} unsubscribed from ${symbol}`);
      socket.leave(`stock:${symbol}`);
    });

    // Client subscribes to general market data (movers, indices)
    socket.on('subscribe_market_overview', () => {
      socket.join('market_overview');
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
