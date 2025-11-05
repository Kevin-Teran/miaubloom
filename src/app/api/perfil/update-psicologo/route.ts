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
  } catch (e) {
    console.warn('Error al verificar JWT en API:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

/**
 * @function POST
 * @description Actualiza el perfil del psicólogo autenticado
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta con éxito o error
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    const userId = auth.userId;

    // 2. Parsear los datos del formulario
    const body = await request.json();
    const { 
      fotoPerfil, 
      especialidad, 
      tituloUniversitario, 
      numeroRegistro 
    } = body;

    // 3. Validar que los datos mínimos estén presentes
    if (!especialidad || !tituloUniversitario || !numeroRegistro) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos profesionales requeridos' },
        { status: 400 }
      );
    }

    // 4. Usar upsert: actualizar si existe, crear si no existe
    const updatedProfile = await prisma.perfilPsicologo.upsert({
      where: { userId: userId },
      update: {
        especialidad: especialidad,
        tituloUniversitario: tituloUniversitario,
        registroProfesional: numeroRegistro,
        identificacion: numeroRegistro,
        ...(fotoPerfil && { fotoPerfil: fotoPerfil }),
      },
      create: {
        userId: userId,
        especialidad: especialidad,
        tituloUniversitario: tituloUniversitario,
        registroProfesional: numeroRegistro,
        identificacion: numeroRegistro,
        fotoPerfil: fotoPerfil || '/assets/avatar-psicologo.png',
      },
    });

    // 5. Responder con éxito
    return NextResponse.json(
      { 
        success: true, 
        message: 'Perfil actualizado exitosamente',
        profile: updatedProfile 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al actualizar perfil de psicólogo:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
