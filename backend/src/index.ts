import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { initSocketManager } from './sockets/socketManager';
import { marketService } from './modules/market/MarketDataService';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

import aiRoutes from './modules/ai/ai.routes';
import alertRoutes from './modules/alert/alert.routes';
import portfolioRoutes from './modules/portfolio/portfolio.routes';
import authRoutes from './modules/auth/auth.routes';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with Redis adapter
initSocketManager(httpServer);

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());
app.use(morgan('dev')); // Setup HTTP request logging

// Mount API routes
app.use('/api', apiLimiter); // Apply rate limiter
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StockPulse AI Backend is running' });
});

// Global error handler must be last
app.use(errorHandler);

// Initialize core services
marketService.start();

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  marketService.stop();
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
