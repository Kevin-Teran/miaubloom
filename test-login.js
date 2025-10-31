const prisma = require('@prisma/client').PrismaClient;

const client = new prisma();

async function test() {
  try {
    const users = await client.user.findMany({
      select: { id: true, email: true, rol: true }
    });
    console.log('Usuarios en BD:', JSON.stringify(users, null, 2));
  } finally {
    await client.$disconnect();
  }
}

test();
