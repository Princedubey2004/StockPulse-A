import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  databaseUrl: process.env.DATABASE_URL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || 'mock-key',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod',
  nodeEnv: process.env.NODE_ENV || 'development'
};
