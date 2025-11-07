import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

/**
 * @function GET
 * @description Obtiene los datos completos del usuario autenticado incluyendo perfil
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Datos del usuario con perfil completo
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('miaubloom_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'No hay sesión activa' 
        },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombreCompleto: true,
        rol: true,
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Sesión inválida' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
          perfilPaciente: user.perfilPaciente,
          perfilPsicologo: user.perfilPsicologo,
          perfilCompleto: user.rol === 'Paciente' 
            ? !!user.perfilPaciente 
            : !!user.perfilPsicologo
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        message: 'Error al obtener usuario' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
