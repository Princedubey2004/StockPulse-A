import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function checkDbConnection() {
  try {
    await prisma.$connect();
    console.log('[Prisma] Successfully connected to database.');
    return true;
  } catch (error) {
    console.warn('[Prisma] Database connection failed. Running in memory/Redis mode without persistence.', error);
    return false;
  }
}
