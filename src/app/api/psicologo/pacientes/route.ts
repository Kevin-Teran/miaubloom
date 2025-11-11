/**
 * @file route.ts
 * @route src/app/api/psicologo/pacientes/route.ts
 * @description API endpoint para obtener pacientes (ACTUALIZADO A JWT)
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

interface PacienteConUsuario {
  userId: string;
  nicknameAvatar: string;
  genero: string;
  fotoPerfil?: string | null;
  user: {
    nombreCompleto: string;
    updatedAt: Date;
    createdAt: Date;
  };
}

/**
 * @function GET
 * @description Obtiene la lista de pacientes (AHORA USA JWT)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autenticado o rol incorrecto' },
        { status: 401 }
      );
    }
    const userId = auth.userId;

    // 2. Obtener el perfil del psicólogo
    const psicologoProfile = await prisma.perfilPsicologo.findUnique({
      where: { userId },
    });

    if (!psicologoProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de psicólogo no encontrado' },
        { status: 404 }
      );
    }

    // 3. Obtener pacientes asignados (lógica existente)
    const pacientes = await prisma.perfilPaciente.findMany({
      where: {
        psicologoAsignadoId: psicologoProfile.userId,
      },
      include: {
        user: {
          select: {
            nombreCompleto: true,
            updatedAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          nombreCompleto: 'asc',
        },
      },
    });

    // 4. Mapear pacientes con lógica de estado
    const pacientesFormateados = pacientes.map((paciente: PacienteConUsuario) => {
      // Calcular estado basado en última actividad (updatedAt)
      const ahora = new Date();
      const ultimaActividad = new Date(paciente.user.updatedAt || paciente.user.createdAt);
      const minutosInactivo = Math.floor((ahora.getTime() - ultimaActividad.getTime()) / (1000 * 60));
      
      let estado = 'Activo';
      if (minutosInactivo > 1440) { // > 24 horas
        estado = 'Inactivo';
      } else if (minutosInactivo > 60) { // > 1 hora
        estado = 'Ausente';
      }
      
      return {
      id: paciente.userId,
      nombre: paciente.user.nombreCompleto,
      nickname: paciente.nicknameAvatar,
      genero: paciente.genero,
      avatar: paciente.fotoPerfil || '/assets/avatar-paciente.png',
        estado,
        ultimaActividad: minutosInactivo,
        ultimaActividadTexto: minutosInactivo < 1 ? 'Ahora' : 
                              minutosInactivo < 60 ? `Hace ${minutosInactivo}m` :
                              Math.floor(minutosInactivo / 60) < 24 ? `Hace ${Math.floor(minutosInactivo / 60)}h` :
                              `Hace ${Math.floor(minutosInactivo / 1440)}d`,
      };
    });

    return NextResponse.json(
      {
        success: true,
        pacientes: pacientesFormateados,
        total: pacientesFormateados.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener pacientes' },
      { status: 500 }
    );
  }
}
