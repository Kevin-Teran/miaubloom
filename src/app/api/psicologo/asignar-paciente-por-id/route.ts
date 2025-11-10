import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { jwtVerify } from 'jose';

/**
 * @function POST
 * @description Asigna un paciente por su ID (sin psicólogo)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { pacienteId } = await request.json();
    if (!pacienteId) {
      return NextResponse.json(
        { success: false, message: 'ID del paciente requerido' },
        { status: 400 }
      );
    }

    // Verificar que el paciente existe y no tiene psicólogo
    const paciente = await prisma.perfilPaciente.findUnique({
      where: { userId: pacienteId },
      include: { user: { select: { nombreCompleto: true } } },
    });

    if (!paciente) {
      return NextResponse.json(
        { success: false, message: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    if (paciente.psicologoAsignadoId) {
      return NextResponse.json(
        { success: false, message: 'Este paciente ya está asignado' },
        { status: 409 }
      );
    }

    // Asignar
    await prisma.perfilPaciente.update({
      where: { userId: pacienteId },
      data: { psicologoAsignadoId: auth.userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${paciente.user.nombreCompleto} asignado exitosamente`,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error assigning patient:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
