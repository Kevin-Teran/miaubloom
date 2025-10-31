/**
 * @file route.ts
 * @route src/app/api/psicologo/pacientes/route.ts
 * @description API endpoint para obtener los pacientes asignados al psicólogo
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PacienteConUsuario {
  userId: string;
  nicknameAvatar: string;
  genero: string;
  fotoPerfil?: string | null;
  user: {
    nombreCompleto: string;
  };
}

/**
 * @function GET
 * @description Obtiene la lista de pacientes asignados al psicólogo autenticado
 * @param {NextRequest} request - Petición HTTP con cookie de sesión
 * @returns {Promise<NextResponse>} Lista de pacientes asignados
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('miaubloom_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    // Obtener el perfil del psicólogo
    const psicologoProfile = await prisma.perfilPsicologo.findUnique({
      where: { userId },
    });

    if (!psicologoProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de psicólogo no encontrado' },
        { status: 404 }
      );
    }

    // Obtener pacientes asignados
    const pacientes = await prisma.perfilPaciente.findMany({
      where: {
        psicologoAsignadoId: psicologoProfile.userId,
      },
      include: {
        user: {
          select: {
            nombreCompleto: true,
          },
        },
      },
      orderBy: {
        user: {
          nombreCompleto: 'asc',
        },
      },
    });

    // Mapear pacientes a formato más legible
    const pacientesFormateados = pacientes.map((paciente: PacienteConUsuario) => ({
      id: paciente.userId,
      nombre: paciente.user.nombreCompleto,
      nickname: paciente.nicknameAvatar,
      genero: paciente.genero,
      avatar: paciente.fotoPerfil || '/assets/avatar-paciente.png',
      estado: 'Activo', // Puedes obtener esto de los registros emocionales
    }));

    return NextResponse.json(
      {
        success: true,
        pacientes: pacientesFormateados,
        total: pacientesFormateados.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener pacientes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
