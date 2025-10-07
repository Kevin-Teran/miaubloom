/**
 * @file prisma.ts
 * @route src/utils/prisma.ts
 * @description 
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { PrismaClient } from '@prisma/client';

// @ts-ignore
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], 
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;