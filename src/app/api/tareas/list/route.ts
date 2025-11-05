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
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose'; // <-- IMPORTAR JOSE

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
  } catch (e) {
    console.warn('Error al verificar JWT en API:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

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
      id: string;
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
      id: tarea.id,
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
    console.error('Error obteniendo tareas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener tareas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
