import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// --- LÓGICA DE AUTENTICACIÓN JWT ---
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
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

/**
 * @function POST
 * @description Asigna un paciente existente (sin psicólogo) al psicólogo autenticado.
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

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email del paciente es requerido' },
        { status: 400 }
      );
    }

    // 1. Encontrar al paciente por email
    const paciente = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { perfilPaciente: true }
    });

    // 2. Validar que el paciente exista y sea un paciente
    if (!paciente || paciente.rol !== 'Paciente' || !paciente.perfilPaciente) {
      return NextResponse.json(
        { success: false, message: 'Paciente no encontrado o el email no corresponde a un paciente.' },
        { status: 404 }
      );
    }

    // 3. Validar si ya está asignado (LA VALIDACIÓN CLAVE)
    if (paciente.perfilPaciente.psicologoAsignadoId) {
      if (paciente.perfilPaciente.psicologoAsignadoId === auth.userId) {
        return NextResponse.json(
          { success: false, message: 'Este paciente ya está en tu lista.' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: 'Este paciente ya está asignado a otro psicólogo.' },
          { status: 403 }
        );
      }
    }

    // 4. Asignar (Éxito)
    const pacienteActualizado = await prisma.perfilPaciente.update({
      where: { userId: paciente.id },
      data: { psicologoAsignadoId: auth.userId },
      include: {
        user: {
          select: { nombreCompleto: true, email: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `¡${pacienteActualizado.user.nombreCompleto} ha sido asignado exitosamente!`,
      paciente: pacienteActualizado
    });

  } catch (error) {
    console.error('Error asignando paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
