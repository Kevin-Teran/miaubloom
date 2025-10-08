/**
 * @file prisma.ts
 * @route src/lib/prisma.ts
 * @description Cliente singleton de Prisma para toda la aplicación.
 * Asegura una sola conexión a la base de datos, optimizado para Next.js.
 */

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}