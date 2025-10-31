/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description API endpoint para autenticación de usuarios (Pacientes y Psicólogos)
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
 * @interface LoginRequestBody
 * @description Estructura del cuerpo de la petición de login
 */
interface LoginRequestBody {
  email: string;
  password: string;
  rol: 'Paciente' | 'Psicólogo';
}

/**
 * @function POST
 * @description Maneja el inicio de sesión de usuarios
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta con datos del usuario o error
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestBody = await request.json();
    const { email, password, rol } = body;

    if (!email || !password || !rol) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email, contraseña y rol son requeridos' 
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        rol: rol
      },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Credenciales inválidas' 
        },
        { status: 401 }
      );
    }

    let perfilCompleto = false;
    let perfilData = null;

    if (rol === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = {
        fechaNacimiento: user.perfilPaciente.fechaNacimiento,
        genero: user.perfilPaciente.genero,
        contactoEmergencia: user.perfilPaciente.contactoEmergencia,
        nicknameAvatar: user.perfilPaciente.nicknameAvatar,
        fotoPerfil: (user.perfilPaciente as Record<string, unknown>).fotoPerfil as string,
        psicologoAsignadoId: user.perfilPaciente.psicologoAsignadoId,
        horarioUso: user.perfilPaciente.horarioUso,
        duracionUso: user.perfilPaciente.duracionUso
      };
    } else if (rol === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = {
        identificacion: user.perfilPsicologo.identificacion,
        registroProfesional: user.perfilPsicologo.registroProfesional,
        especialidad: user.perfilPsicologo.especialidad,
        tituloUniversitario: user.perfilPsicologo.tituloUniversitario,
        fotoPerfil: (user.perfilPsicologo as Record<string, unknown>).fotoPerfil as string
      };
    }

    const responseData = {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
        perfilCompleto,
        perfil: perfilData
      }
    };

    const response = NextResponse.json(responseData, { status: 200 });
    
    response.cookies.set('miaubloom_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, 
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error en el login:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * @function GET
 * @description Verifica si existe una sesión activa
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Estado de la sesión
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('miaubloom_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'No hay sesión activa' 
        },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombreCompleto: true,
        rol: true,
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Sesión inválida' 
        },
        { status: 401 }
      );
    }

    let perfilCompleto = false;
    let perfilData = null;

    if (user.rol === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = {
        fechaNacimiento: user.perfilPaciente.fechaNacimiento,
        genero: user.perfilPaciente.genero,
        contactoEmergencia: user.perfilPaciente.contactoEmergencia,
        nicknameAvatar: user.perfilPaciente.nicknameAvatar,
        psicologoAsignadoId: user.perfilPaciente.psicologoAsignadoId,
        fotoPerfil: (user.perfilPaciente as Record<string, unknown>).fotoPerfil as string,
        horarioUso: user.perfilPaciente.horarioUso,
        duracionUso: user.perfilPaciente.duracionUso
      };
    } else if (user.rol === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = {
        identificacion: user.perfilPsicologo.identificacion,
        registroProfesional: user.perfilPsicologo.registroProfesional,
        especialidad: user.perfilPsicologo.especialidad,
        tituloUniversitario: user.perfilPsicologo.tituloUniversitario,
        fotoPerfil: (user.perfilPsicologo as Record<string, unknown>).fotoPerfil as string
      };
    }

    return NextResponse.json(
      { 
        success: true, 
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
          perfilCompleto,
          perfil: perfilData
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verificando sesión:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        message: 'Error al verificar sesión' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}