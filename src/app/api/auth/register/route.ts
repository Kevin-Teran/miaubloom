/**
 * @file route.ts
 * @route src/app/api/auth/register/route.ts
 * @description API endpoint para registro de nuevos usuarios (Pacientes y Psicólogos)
 * @author Kevin Mariano
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email, password, nombreCompleto, rol,
      day, month, year, genero, contactoEmergencia, institucionReferida, nombreInstitucion,
      numeroRegistro, especialidad, tituloUniversitario,
      idNombreAvatar, horarioUso, duracionUso
    } = body;

    // Validación de datos básicos
    if (!email || !password || !nombreCompleto || !rol) {
      return NextResponse.json({ success: false, message: 'Los datos básicos son requeridos' }, { status: 400 });
    }

    // Validación para Paciente
    if (rol === 'Paciente') {
      if (!day || !month || !year) {
        return NextResponse.json({ success: false, message: 'La fecha de nacimiento es requerida' }, { status: 400 });
      }
      if (!genero) {
        return NextResponse.json({ success: false, message: 'El género es requerido' }, { status: 400 });
      }
      if (!contactoEmergencia) {
        return NextResponse.json({ success: false, message: 'El contacto de emergencia es requerido' }, { status: 400 });
      }
      if (institucionReferida === 'Pública' && !nombreInstitucion) {
        return NextResponse.json({ success: false, message: 'El nombre de institución es requerido para instituciones públicas' }, { status: 400 });
      }
    }
    // Validación para Psicólogo
    else if (rol === 'Psicólogo') {
      if (!numeroRegistro) {
        return NextResponse.json({ success: false, message: 'El número de registro es requerido' }, { status: 400 });
      }
      if (!especialidad) {
        return NextResponse.json({ success: false, message: 'La especialidad es requerida' }, { status: 400 });
      }
      if (!tituloUniversitario) {
        return NextResponse.json({ success: false, message: 'El título universitario es requerido' }, { status: 400 });
      }
    }

    // Validación de horarioUso y duracionUso (comunes)
    if (!horarioUso) {
      return NextResponse.json({ success: false, message: 'El horario de uso es requerido' }, { status: 400 });
    }
    if (!duracionUso) {
      return NextResponse.json({ success: false, message: 'La duración de uso es requerida' }, { status: 400 });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Este correo electrónico ya está registrado' }, { status: 409 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Crear el usuario
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          nombreCompleto: nombreCompleto.trim(),
          rol: rol,
        },
      });

      // 2. Crear el perfil correspondiente
      if (rol === 'Paciente') {
        const fechaNacimiento = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        const perfilData: Record<string, unknown> = {
          userId: user.id,
          fechaNacimiento,
          genero,
          contactoEmergencia,
          institucionReferida,
          nombreInstitucion: institucionReferida === 'Pública' ? nombreInstitucion : null,
          nicknameAvatar: idNombreAvatar || 'Nikky01',
          horarioUso,
          duracionUso,
        };
        await tx.perfilPaciente.create({ data: perfilData as Parameters<typeof tx.perfilPaciente.create>[0]['data'] });
      } else if (rol === 'Psicólogo') {
        const perfilData: Record<string, unknown> = {
          userId: user.id,
          identificacion: numeroRegistro,
          registroProfesional: numeroRegistro,
          especialidad,
          tituloUniversitario,
          nicknameAvatar: idNombreAvatar || 'Avatar',
          horarioUso,
          duracionUso,
        };
        await tx.perfilPsicologo.create({ data: perfilData as Parameters<typeof tx.perfilPsicologo.create>[0]['data'] });
      }
      return user;
    });

    if (!newUser) {
        throw new Error("La creación del usuario falló.");
    }

    const responseData = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, email: newUser.email, nombreCompleto: newUser.nombreCompleto, rol: newUser.rol }
    };

    const response = NextResponse.json(responseData, { status: 201 });
    response.cookies.set('miaubloom_session', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });
    return response;

  } catch (error) {
    console.error('Error en API de registro:', error);
    let errorMessage = 'Error interno del servidor';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @function GET
 * @description Verifica disponibilidad de email
 * @param {NextRequest} request - Petición HTTP con query param ?email=...
 * @returns {Promise<NextResponse>} Estado de disponibilidad del email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email es requerido'
        },
        { status: 400 }
      );
    }

    // Verificar si el email existe
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    return NextResponse.json(
      {
        success: true,
        available: !existingUser,
        message: existingUser
          ? 'Este email ya está registrado'
          : 'Email disponible'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verificando email:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error al verificar disponibilidad del email'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}