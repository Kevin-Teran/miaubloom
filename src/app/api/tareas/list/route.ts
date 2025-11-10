/**
 * @file route.ts
 * @route src/app/api/tareas/list/route.ts
 * @description API endpoint para tareas (ACTUALIZADO A JWT)
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

/**
 * @function GET
 * @description Obtiene las tareas (AHORA USA JWT)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Paciente') {
      return NextResponse.json(
        { success: false, message: 'No autenticado o rol incorrecto' },
        { status: 401 }
      );
    }
    const userId = auth.userId;

    // 2. Obtener el perfil del paciente
    const pacienteProfile = await prisma.perfilPaciente.findUnique({
      where: { userId },
    });

    if (!pacienteProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de paciente no encontrado' },
        { status: 404 }
      );
    }

    // 3. Obtener tareas (lógica existente)
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

    // 4. Mapear tareas (lógica existente)
    interface TareaType {
      id: number;
      descripcion: string;
      fechaLimite: Date;
      estado: string;
      psicologo?: {
        user?: {
          nombreCompleto: string;
        };
      };
    }

    const tareasFormateadas = tareas.map((tarea: TareaType) => ({
      id: tarea.id.toString(),
      titulo: tarea.descripcion.split('\n')[0],
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
    return NextResponse.json(
      { success: false, message: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}
