/**
 * @file prisma.ts
 * @route src/lib/prisma.ts
 * @description Cliente Prisma singleton para toda la aplicación
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { PrismaClient } from '@prisma/client';

/**
 * Singleton de Prisma Client
 * Evita crear múltiples instancias en desarrollo (hot reload)
 * Mantiene connection pooling eficiente en producción
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

