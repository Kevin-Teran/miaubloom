/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description Manejador de API para el inicio de sesión. 
 * Utiliza Prisma, verifica credenciales y genera un JWT.
 * @author Kevin Mariano
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { comparePassword, generateAuthToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        perfilPaciente: true, 
        perfilPsicologo: true, 
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
    }

    const passwordIsValid = await comparePassword(password, user.passwordHash);

    if (!passwordIsValid) {
      return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
    }

    let isProfileComplete = false;
    
    if (user.rol === 'Paciente' && user.perfilPaciente) {
        isProfileComplete = true;
    } else if (user.rol === 'Psicólogo' && user.perfilPsicologo) {
        isProfileComplete = true;
    }

    const token = generateAuthToken({
        id: user.id,
        email: user.email,
        rol: user.rol,
        nombreCompleto: user.nombreCompleto
    }); 

    const sessionData = {
      token,
      rol: user.rol,
      isProfileComplete, 
      userId: user.id,
      nombreCompleto: user.nombreCompleto,
    };

    const response = NextResponse.json({ 
        message: 'Inicio de sesión exitoso.', 
        sessionData 
    });
    
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, 
        path: '/',
    });

    return response;

  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}