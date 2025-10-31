/**
 * @file route.ts
 * @route src/app/api/tareas/list/route.ts
 * @description API endpoint para obtener las tareas del paciente autenticado
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @function GET
 * @description Obtiene las tareas pendientes del paciente autenticado
 * @param {NextRequest} request - Petición HTTP con cookie de sesión
 * @returns {Promise<NextResponse>} Lista de tareas del paciente
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

    // Obtener el perfil del paciente para acceder a las tareas
    const pacienteProfile = await prisma.perfilPaciente.findUnique({
      where: { userId },
    });

    if (!pacienteProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de paciente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener tareas del paciente
    const tareas = await prisma.tarea.findMany({
      where: {
        pacienteId: pacienteProfile.userId,
      },
      select: {
        id: true,
        descripcion: true,
        fechaLimite: true,
        estado: true,
        psicologo: {
          select: {
            user: {
              select: {
                nombreCompleto: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaLimite: 'asc',
      },
    });

    // Mapear tareas a formato más legible
    const tareasFormateadas = tareas.map(tarea => ({
      id: tarea.id,
      titulo: tarea.descripcion.split('\n')[0], // Primera línea como título
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite,
      estado: tarea.estado,
      psicologoNombre: tarea.psicologo?.user?.nombreCompleto || 'Sin asignar',
      etiqueta: tarea.estado === 'Completada' ? 'Completada' : 'Pendiente',
    }));

    return NextResponse.json(
      {
        success: true,
        tareas: tareasFormateadas,
        total: tareasFormateadas.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener tareas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
