/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description API completamente funcional para inicio de sesión con validaciones robustas
 * @author Kevin Mariano
 * @version 2.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { comparePassword, generateAuthToken } from '@/utils/auth';

interface LoginResponse {
  message: string;
  sessionData?: {
    token: string;
    rol: string;
    isProfileComplete: boolean;
    userId: string;
    nombreCompleto: string;
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, expectedRole } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'El correo electrónico y la contraseña son requeridos.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'El formato del correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    const passwordIsValid = await comparePassword(password, user.password);

    if (!passwordIsValid) {
      return NextResponse.json(
        { message: 'Credenciales inválidas. Verifica tu correo y contraseña.' },
        { status: 401 }
      );
    }

    if (expectedRole && user.rol !== expectedRole) {
      return NextResponse.json(
        { 
          message: `Esta cuenta está registrada como ${user.rol}. Por favor, selecciona el rol correcto.` 
        },
        { status: 403 }
      );
    }

    let isProfileComplete = false;
    
    if (user.rol === 'Paciente') {
      isProfileComplete = !!user.perfilPaciente;
    } else if (user.rol === 'Psicólogo') {
      isProfileComplete = !!user.perfilPsicologo;
    }

    const token = generateAuthToken({
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
    });

    const sessionData = {
      token,
      rol: user.rol,
      isProfileComplete,
      userId: user.id,
      nombreCompleto: user.nombreCompleto,
    };

    const response = NextResponse.json<LoginResponse>(
      {
        message: 'Inicio de sesión exitoso.',
        sessionData,
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    console.log(`[AUTH] Login exitoso: ${email} como ${user.rol}`);

    return response;

  } catch (error) {
    console.error('[AUTH] Error durante el inicio de sesión:', error);
    
    return NextResponse.json(
      { 
        message: 'Error interno del servidor. Por favor, intenta más tarde.' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}