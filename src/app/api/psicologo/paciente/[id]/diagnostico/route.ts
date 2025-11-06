import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

async function getAuthPayload(request: NextRequest): Promise<{ userId: string; rol: string } | null> {
  const token = request.cookies.get('miaubloom_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { userId: payload.userId as string, rol: payload.rol as string };
  } catch {
    return null;
  }
}

/**
 * @function POST
 * @description Actualiza la información de diagnóstico de un paciente
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pacienteId } = await params;
    const auth = await getAuthPayload(request);

    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { diagnostico, duracionTratamiento } = body;

    if (typeof diagnostico === 'undefined' || typeof duracionTratamiento === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Faltan campos (diagnostico, duracionTratamiento)' },
        { status: 400 }
      );
    }

    // Validar que el paciente existe y pertenece a este psicólogo
    const paciente = await prisma.perfilPaciente.findFirst({
      where: {
        userId: pacienteId,
        psicologoAsignadoId: auth.userId,
      },
    });

    if (!paciente) {
      return NextResponse.json(
        { success: false, message: 'Paciente no encontrado o no asignado a este psicólogo' },
        { status: 404 }
      );
    }

    // Actualizar el diagnóstico
    await prisma.perfilPaciente.update({
      where: {
        userId: pacienteId,
      },
      data: {
        diagnostico,
        duracionTratamiento,
      } as unknown as Record<string, unknown>,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Diagnóstico actualizado correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando diagnóstico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
