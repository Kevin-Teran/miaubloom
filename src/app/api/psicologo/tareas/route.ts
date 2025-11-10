import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

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
    return NextResponse.json(
      { success: false, message: 'Error al asignar la tarea' },
      { status: 500 }
    );
  }
}
