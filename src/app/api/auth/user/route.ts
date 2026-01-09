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

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura-aqui');

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('miaubloom_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'No hay sesión activa' }, 
        { status: 401 }
      );
    }

    let userId: string;
    let userRole: string;

    try {
      const { payload } = await jwtVerify(sessionToken, SECRET_KEY);
      userId = payload.userId as string;
      userRole = payload.rol as string;
    } catch (error) {
      console.error('[AUTH/USER] JWT inválido:', error);
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Sesión expirada' }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Usuario no encontrado' }, 
        { status: 401 }
      );
    }

    let perfilCompleto = false;
    let perfilData = null;

    if (user.rol === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = user.perfilPaciente;
    } else if (user.rol === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = user.perfilPsicologo;
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
        perfilCompleto,
        perfil: perfilData
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json({ success: false, message: 'Error de servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}