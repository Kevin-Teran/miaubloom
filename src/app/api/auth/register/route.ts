/**
 * @file route.ts
 * @route src/app/api/auth/register/route.ts
 * @description API endpoint para registro de nuevos usuarios (Pacientes y Psicólogos)
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * @interface RegisterRequestBody
 * @description Estructura del cuerpo de la petición de registro
 */
interface RegisterRequestBody {
  email: string;
  password: string;
  nombreCompleto: string;
  rol: 'Paciente' | 'Psicólogo';
}

/**
 * @function POST
 * @description Registra un nuevo usuario en el sistema
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta con datos del usuario creado o error
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la petición
    const body: RegisterRequestBody = await request.json();
    const { email, password, nombreCompleto, rol } = body;

    // Validar campos requeridos
    if (!email || !password || !nombreCompleto || !rol) {
      return NextResponse.json(
        {
          success: false,
          message: 'Todos los campos son requeridos'
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'El formato del correo electrónico no es válido'
        },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        },
        { status: 400 }
      );
    }

    // Validar rol
    if (rol !== 'Paciente' && rol !== 'Psicólogo') {
      return NextResponse.json(
        {
          success: false,
          message: 'El rol debe ser "Paciente" o "Psicólogo"'
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Este correo electrónico ya está registrado'
        },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        nombreCompleto: nombreCompleto.trim(),
        rol: rol
      },
      select: {
        id: true,
        email: true,
        nombreCompleto: true,
        rol: true,
        createdAt: true
      }
    });

    // Preparar respuesta exitosa
    const responseData = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        nombreCompleto: newUser.nombreCompleto,
        rol: newUser.rol,
        perfilCompleto: false
      }
    };

    // Crear respuesta con cookie de sesión
    const response = NextResponse.json(responseData, { status: 201 });

    // Configurar cookie de sesión (7 días)
    response.cookies.set('miaubloom_session', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error en el registro:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor al registrar usuario'
      },
      { status: 500 }
    );
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