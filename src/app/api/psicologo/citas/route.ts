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
 * @description Obtiene todas las citas asignadas al psicólogo autenticado (FORMATO DE LISTA)
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

    const citas = await prisma.cita.findMany({
      where: {
        psicologoId: auth.userId,
      },
      include: {
        paciente: {
          select: {
            user: {
              select: { nombreCompleto: true, email: true },
            },
            fotoPerfil: true,
          },
        },
      },
      orderBy: {
        fechaHora: 'desc',
      },
    });

    const citasFormateadas = citas.map((cita) => ({
      id: cita.id,
      fechaHoraInicio: cita.fechaHora.toISOString(),
      estado: cita.estado,
      paciente: {
        id: cita.pacienteId,
        nombreCompleto: cita.paciente.user.nombreCompleto,
        email: cita.paciente.user.email,
        avatar: cita.paciente.fotoPerfil || '/assets/avatar-paciente.png',
      },
    }));

    return NextResponse.json(
      { success: true, citas: citasFormateadas },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener citas' },
      { status: 500 }
    );
  }
}

/**
 * @function POST
 * @description Crea una nueva cita para un paciente
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

    const body = await request.json();
    const { pacienteId, fecha, horaInicio, duracionMin } = body;

    if (!pacienteId || !fecha || !horaInicio || !duracionMin) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el paciente pertenece a este psicólogo
    const pacienteAsignado = await prisma.perfilPaciente.findFirst({
      where: {
        userId: pacienteId,
        psicologoAsignadoId: auth.userId,
      },
    });

    if (!pacienteAsignado) {
      return NextResponse.json(
        { success: false, message: 'No tiene permiso para agendar citas a este paciente' },
        { status: 403 }
      );
    }

    // Construir la fecha de inicio
    const [year, month, day] = fecha.split('-').map(Number);
    const [hours, minutes] = horaInicio.split(':').map(Number);
    const fechaHora = new Date(year, month - 1, day, hours, minutes);

    const nuevaCita = await prisma.cita.create({
      data: {
        pacienteId,
        psicologoId: auth.userId,
        fechaHora,
        estado: 'Programada',
        detalles: 'Cita programada',
        creadaPor: auth.userId,
      },
      include: {
        paciente: {
          select: {
            user: {
              select: { nombreCompleto: true, email: true },
            },
            fotoPerfil: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cita creada exitosamente',
        cita: {
          id: nuevaCita.id,
          fechaHoraInicio: nuevaCita.fechaHora.toISOString(),
          estado: nuevaCita.estado,
          paciente: {
            id: nuevaCita.pacienteId,
            nombreCompleto: nuevaCita.paciente.user.nombreCompleto,
            email: nuevaCita.paciente.user.email,
            avatar: nuevaCita.paciente.fotoPerfil || '/assets/avatar-paciente.png',
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando cita:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear la cita' },
      { status: 500 }
    );
  }
}
