import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    // Obtener la sesión del cookie
    const sessionCookie = req.cookies.get('miaubloom_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    // Parsear el body
    const body = await req.json();
    const { horarioUso, duracionUso } = body;

    if (!horarioUso || !duracionUso) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
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

    // Actualizar el perfil según el rol
    if (user.rol === 'Paciente') {
      await prisma.perfilPaciente.update({
        where: { userId },
        data: {
          horarioUso,
          duracionUso
        }
      });
    } else if (user.rol === 'Psicólogo') {
      await prisma.perfilPsicologo.update({
        where: { userId },
        data: {
          horarioUso,
          duracionUso
        }
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
