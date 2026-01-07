/**
 * @file route.ts
 * @route src/app/api/auth/user/route.ts
 * @description API endpoint para obtener datos de usuario. AHORA LEE DESDE COOKIE.
 * @author Kevin Mariano
 * @version 2.0.0 (CORREGIDO)
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// 🔐 MISMO SECRET QUE LOGIN
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('miaubloom_session')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    let payload: any;
    try {
      const result = await jwtVerify(token, SECRET_KEY);
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
          perfilPaciente: user.perfilPaciente,
          perfilPsicologo: user.perfilPsicologo,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH USER ERROR]', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
