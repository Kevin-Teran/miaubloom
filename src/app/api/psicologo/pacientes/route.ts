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

interface PacienteConUsuario {
  userId: string;
  nicknameAvatar: string;
  genero: string;
  fotoPerfil?: string | null;
  user: {
    nombreCompleto: string;
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
          },
        },
      },
      orderBy: {
        user: {
          nombreCompleto: 'asc',
        },
      },
    });

    // 4. Mapear pacientes (lógica existente)
    const pacientesFormateados = pacientes.map((paciente: PacienteConUsuario) => ({
      id: paciente.userId,
      nombre: paciente.user.nombreCompleto,
      nickname: paciente.nicknameAvatar,
      genero: paciente.genero,
      avatar: paciente.fotoPerfil || '/assets/avatar-paciente.png',
      estado: 'Activo', // TODO: Implementar lógica de estado
    }));

    return NextResponse.json(
      {
        success: true,
        pacientes: pacientesFormateados,
        total: pacientesFormateados.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener pacientes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
