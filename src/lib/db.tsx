// Database connection and utilities
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config({ path: '.env' });

// Temporary: Set DATABASE_URL directly for testing
process.env.DATABASE_URL =
  'postgresql://neondb_owner:npg_We7MG2jnbJou@ep-rapid-resonance-a1chty82-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
