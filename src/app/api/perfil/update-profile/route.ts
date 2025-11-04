import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// Clave secreta para verificar JWT
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

interface JWTPayload {
  userId: string;
  rol: string;
  [key: string]: unknown;
}

export async function PUT(req: NextRequest) {
  try {
    // Obtener el JWT de la cookie
    const sessionCookie = req.cookies.get('miaubloom_session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el JWT
    let payload: JWTPayload;
    try {
      const { payload: decodedPayload } = await jwtVerify(
        sessionCookie.value,
        SECRET_KEY
      );
      payload = decodedPayload as JWTPayload;
    } catch (error) {
      console.error('[UpdateProfile] Error al verificar JWT:', error);
      return NextResponse.json(
        { error: 'Sesión inválida o expirada' },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Parsear el body
    const body = await req.json();
    const { horarioUso, duracionUso, fotoPerfil } = body;

    if (!horarioUso || !duracionUso) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (horario/duracion)' },
        { status: 400 }
      );
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear el objeto de datos para actualizar
    const dataToUpdate: Record<string, unknown> = {
      horarioUso,
      duracionUso,
    };

    // Incluir fotoPerfil si se proporcionó
    if (fotoPerfil) {
      dataToUpdate.fotoPerfil = fotoPerfil;
    }

    // Actualizar el perfil según el rol
    if (user.rol === 'Paciente') {
      await prisma.perfilPaciente.update({
        where: { userId },
        data: dataToUpdate
      });
    } else if (user.rol === 'Psicólogo') {
      await prisma.perfilPsicologo.update({
        where: { userId },
        data: dataToUpdate
      });
    } else {
      return NextResponse.json(
        { error: 'Rol no válido' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
