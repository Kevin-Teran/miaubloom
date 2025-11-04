import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @function POST
 * @description Actualiza el perfil del psicólogo autenticado
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta con éxito o error
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Obtener la sesión del cookie
    const sessionCookie = request.cookies.get('miaubloom_session');
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    const userId = sessionCookie.value;

    // 2. Parsear los datos del formulario
    const body = await request.json();
    const { 
      fotoPerfil, 
      especialidad, 
      tituloUniversitario, 
      numeroRegistro 
    } = body;

    // 3. Validar que los datos mínimos estén presentes
    if (!especialidad || !tituloUniversitario || !numeroRegistro) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos profesionales requeridos' },
        { status: 400 }
      );
    }

    // 4. Actualizar el perfil del psicólogo en la BD
    const updatedProfile = await prisma.perfilPsicologo.update({
      where: { userId: userId },
      data: {
        especialidad: especialidad,
        tituloUniversitario: tituloUniversitario,
        registroProfesional: numeroRegistro, // Campo en BD: registro_profesional
        identificacion: numeroRegistro,      // Campo en BD: identificacion (asumimos que es el mismo)
        // Incluir fotoPerfil si se proporcionó
        ...(fotoPerfil && { fotoPerfil: fotoPerfil }),
      },
    });

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de psicólogo no encontrado' },
        { status: 404 }
      );
    }

    // 5. Responder con éxito
    return NextResponse.json(
      { 
        success: true, 
        message: 'Perfil actualizado exitosamente',
        profile: updatedProfile 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al actualizar perfil de psicólogo:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
