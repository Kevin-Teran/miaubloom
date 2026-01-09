/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description API endpoint para autenticación. AHORA CREA JWT Y LO SETEA EN COOKIE.
 * @author Kevin Mariano
 * @version 3.0.0 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// IMPORTANTE: Usa JWT_SECRET para coincidir con tu .env
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura-aqui');

interface LoginRequestBody {
  email: string;
  password: string;
  rol: 'Paciente' | 'Psicólogo';
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestBody = await request.json();
    const { email, password, rol } = body;

    if (!email || !password || !rol) {
      return NextResponse.json({ success: false, message: 'Email, contraseña y rol son requeridos' }, { status: 400 });
    }

    // Buscamos al usuario incluyendo sus perfiles
    const user = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase().trim(), 
        rol: rol 
      },
      include: { 
        perfilPaciente: true, 
        perfilPsicologo: true 
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 });
    }

    let perfilCompleto = false;
    let perfilData: Record<string, any> = {};

    if (rol === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = user.perfilPaciente;
    } else if (rol === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = user.perfilPsicologo;
    }

    // Generación del JWT
    const payload = { 
      userId: user.id, 
      email: user.email, 
      rol: user.rol, 
      nombreCompleto: user.nombreCompleto 
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
        perfilCompleto,
        perfil: perfilData
      }
    }, { status: 200 });

    // Seteamos la cookie de sesión
    response.cookies.set('miaubloom_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    console.log(`[LOGIN] Usuario ${user.email} autenticado.`);
    return response;

  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}