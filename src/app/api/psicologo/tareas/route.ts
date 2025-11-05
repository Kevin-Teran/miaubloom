import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// --- LÓGICA DE AUTENTICACIÓN JWT REUTILIZABLE ---
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
 * @description Asigna una nueva tarea a un paciente
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
    const { pacienteId, titulo, descripcion, fechaLimite } = body;

    if (!pacienteId || !titulo || !descripcion || !fechaLimite) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Validar que el paciente pertenece a este psicólogo
    const paciente = await prisma.perfilPaciente.findFirst({
        where: {
            userId: pacienteId,
            psicologoAsignadoId: auth.userId
        }
    });
    
    if (!paciente) {
        return NextResponse.json(
          { success: false, message: 'No tiene permiso para asignar tareas a este paciente.' },
          { status: 403 }
        );
    }

    const nuevaTarea = await prisma.tarea.create({
      data: {
        pacienteId: pacienteId,
        psicologoId: auth.userId,
        descripcion: `${titulo}\n${descripcion}`, // Guardamos título y desc en un solo campo
        estado: 'Pendiente',
        fechaLimite: new Date(fechaLimite),
        createdBy: auth.userId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Tarea asignada exitosamente', tarea: nuevaTarea },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando tarea:', error);
    return NextResponse.json(
      { success: false, message: 'Error al asignar la tarea' },
      { status: 500 }
    );
  }
}
