/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description API endpoint para autenticación. AHORA CREA JWT Y LO SETEA EN COOKIE.
 * @author Kevin Mariano
 * @version 3.0.0 (CORREGIDO)
 * @since 1.0.0
 * @copyright MiauBloom
 */


import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// 🔐 SECRET OBLIGATORIO (DEBE EXISTIR EN VERCEL)
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

interface LoginRequestBody {
  email: string;
  password: string;
  rol: 'Paciente' | 'Psicólogo';
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, rol }: LoginRequestBody = await request.json();

    if (!email || !password || !rol) {
      return NextResponse.json(
        { success: false, message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        rol,
      },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 🧾 Payload JWT
    const payload = {
      userId: user.id,
      email: user.email,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
        },
      },
      { status: 200 }
    );

    // 🍪 COOKIE CORRECTA PARA VERCEL
    response.cookies.set('miaubloom_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
