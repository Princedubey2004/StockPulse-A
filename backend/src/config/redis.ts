import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Main Redis client for general caching
export const redisClient = new Redis(REDIS_URL, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Pub/Sub clients for Socket.io adapter
export const pubClient = new Redis(REDIS_URL);
export const subClient = pubClient.duplicate();

// Dedicated Pub/Sub clients for internal microservices (Market Data -> Alert Service)
export const marketPubClient = new Redis(REDIS_URL);
export const marketSubClient = new Redis(REDIS_URL);

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
