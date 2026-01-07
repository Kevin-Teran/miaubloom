/**
 * @file route.ts
 * @route src/app/api/auth/user/route.ts
 * @description API endpoint para obtener datos de usuario. AHORA LEE DESDE COOKIE.
 * @author Kevin Mariano
 * @version 2.0.0 (CORREGIDO)
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nombreCompleto: true,
        rol: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[AUTH_USER_ERROR]', error);
    return NextResponse.json(
      { error: 'Sesión inválida' },
      { status: 401 }
    );
  }
}
