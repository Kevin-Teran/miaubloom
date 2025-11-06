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
