/**
 * @file route.ts
 * @route src/app/api/auth/register/route.ts
 * @description API endpoint para registro. AHORA CREA JWT.
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Clave secreta para FIRMAR el token.
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email, password, nombreCompleto, rol,
      day, month, year, genero, contactoEmergencia, institucionReferida, nombreInstitucion,
      numeroRegistro, especialidad, tituloUniversitario,
      nicknameAvatar, horarioUso, duracionUso, fotoPerfil
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
    let userPayload: Record<string, unknown> = {}; // Para el JWT

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newUser = await prisma.$transaction(async (tx: any) => {
      // 1. Crear el usuario
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          nombreCompleto: nombreCompleto.trim(),
          rol: rol,
        },
      });

      // 2. Crear el perfil correspondiente y definir el payload del JWT
      userPayload = {
        userId: user.id,
        email: user.email,
        rol: user.rol,
        nombreCompleto: user.nombreCompleto,
      };

      if (rol === 'Paciente') {
        const fechaNacimiento = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        const perfilData: Record<string, unknown> = {
          userId: user.id,
          fechaNacimiento,
          genero,
          contactoEmergencia,
          institucionReferida,
          nombreInstitucion: institucionReferida === 'Pública' ? nombreInstitucion : null,
          nicknameAvatar: nicknameAvatar || 'Nikky01',
          fotoPerfil: fotoPerfil || '/assets/avatar-paciente.png',
          horarioUso,
          duracionUso,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await tx.perfilPaciente.create({ data: perfilData as any });
        
        // Añadir datos del perfil al payload del token
        userPayload.genero = genero;
        userPayload.nicknameAvatar = nicknameAvatar;

      } else if (rol === 'Psicólogo') {
        const perfilData: Record<string, unknown> = {
          userId: user.id,
          genero,
          identificacion: numeroRegistro,
          registroProfesional: numeroRegistro,
          especialidad,
          tituloUniversitario,
          nicknameAvatar: nicknameAvatar || 'Avatar',
          horarioUso,
          duracionUso,
          fotoPerfil: fotoPerfil || '/assets/avatar-psicologo.png',
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await tx.perfilPsicologo.create({ data: perfilData as any });

        // Añadir datos del perfil al payload del token
        userPayload.genero = genero;
        userPayload.especialidad = especialidad;
        userPayload.numeroRegistro = numeroRegistro;
      }
      return user;
    });

    if (!newUser) {
        throw new Error("La creación del usuario falló.");
    }

    // --- LÓGICA DE CREACIÓN DE JWT ---
    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);
    
    // --- CORRECCIÓN CRÍTICA: Usar response.cookies.set() ---
    const responseData = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userPayload // Devuelve el payload completo
    };

    // Crear la respuesta PRIMERO
    const response = NextResponse.json(responseData, { status: 201 });

    // Establecer la cookie EN LA RESPUESTA (no en server context)
    response.cookies.set('miaubloom_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error en API de registro:', error);
    let errorMessage = 'Error interno del servidor';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Stack:', error.stack);
    } else {
      console.error('Error desconocido:', JSON.stringify(error));
    }
    
    // Comprobar si es un error de Prisma
    if (error instanceof Error && 'code' in error) {
      console.error('Código de error Prisma:', (error as Record<string, unknown>).code);
      console.error('Meta:', (error as Record<string, unknown>).meta);
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