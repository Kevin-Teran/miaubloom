import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { jwtVerify } from 'jose';

/**
 * @function GET
 * @description Obtiene lista de pacientes sin psicólogo asignado
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const pacientes = await prisma.perfilPaciente.findMany({
      where: {
        psicologoAsignadoId: null, // Solo los sin psicólogo
      },
      include: {
        user: {
          select: {
            id: true,
            nombreCompleto: true,
            email: true,
          },
        },
      },
    });

    const formatted = pacientes.map((p) => ({
      id: p.user.id,
      nombreCompleto: p.user.nombreCompleto,
      email: p.user.email,
    }));

    return NextResponse.json(
      { success: true, pacientes: formatted },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching available patients:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener pacientes disponibles' },
      { status: 500 }
    );
  }
}
