/**
 * @file route.ts
 * @route src/app/api/auth/login/route.ts
 * @description API endpoint para autenticación. AHORA CREA JWT Y LO SETEA EN COOKIE.
 * @author Kevin Mariano
 * @version 3.0.0 (CORREGIDO)
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { SECRET_KEY } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * @interface LoginRequestBody
 */
interface LoginRequestBody {
  email: string;
  password: string;
  rol: 'Paciente' | 'Psicólogo';
}

/**
 * @function POST
 * @description Maneja el inicio de sesión y CREA UN JWT Y SETEA LA COOKIE
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestBody = await request.json();
    const { email, password, rol } = body;

    if (!email || !password || !rol) {
      return NextResponse.json(
        { success: false, message: 'Email, contraseña y rol son requeridos' },
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
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    let perfilCompleto = false;
    let perfilData: Record<string, unknown> = {}; // Objeto para el payload

    if (rol === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = {
        genero: user.perfilPaciente.genero,
        nicknameAvatar: user.perfilPaciente.nicknameAvatar,
        fotoPerfil: (user.perfilPaciente as Record<string, unknown>).fotoPerfil as string,
      };
    } else if (rol === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = {
        genero: user.perfilPsicologo.genero,
        especialidad: user.perfilPsicologo.especialidad,
        numeroRegistro: user.perfilPsicologo.registroProfesional,
      };
    }

    // --- LÓGICA DE CREACIÓN DE JWT ---
    const payload = {
      userId: user.id,
      email: user.email,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
      ...perfilData
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 días de expiración
      .sign(SECRET_KEY);
    
    // --- CORRECCIÓN CRÍTICA: Establecer la cookie ---
    const responseData = {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
        perfilCompleto,
        perfil: perfilData // Devuelve los datos del perfil si es necesario
      }
    };

    // Crear la respuesta con el token en JSON
    const response = NextResponse.json(responseData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
    // Establecer la cookie httpOnly
    response.cookies.set('miaubloom_session', token, {
      httpOnly: true,
      secure: false, // En desarrollo es false, en producción debe ser true
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    // ESTE ES EL LOG QUE DEBERÍAS VER AHORA
    console.log('[LOGIN] Usuario autenticado, cookie establecida.');
    
    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * @function GET
 * @description Retorna los datos del usuario autenticado basado en el JWT (LEYENDO DE COOKIE)
 * (Este es el código que ya actualizamos en el paso anterior, pero lo incluyo
 * para asegurar que el archivo esté 100% correcto)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('miaubloom_session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'No hay sesión activa' 
        },
        { status: 401 }
      );
    }

    // Verificar el JWT
    let payload: Record<string, unknown>;
    try {
      const { payload: decodedPayload } = await jwtVerify(
        sessionCookie.value,
        SECRET_KEY
      );
      payload = decodedPayload as Record<string, unknown>;
    } catch (err) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Sesión inválida o expirada' 
        },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;
    const userRole = payload.rol as string;

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Token inválido' 
        },
        { status: 401 }
      );
    }

    // Obtener datos del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        perfilPaciente: true,
        perfilPsicologo: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Usuario no encontrado' 
        },
        { status: 401 }
      );
    }

    // Preparar datos del perfil
    let perfilCompleto = false;
    let perfilData = null;

    if (userRole === 'Paciente' && user.perfilPaciente) {
      perfilCompleto = true;
      perfilData = user.perfilPaciente;
    } else if (userRole === 'Psicólogo' && user.perfilPsicologo) {
      perfilCompleto = true;
      perfilData = user.perfilPsicologo;
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
    
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        message: 'Error al verificar sesión' 
      },
      { status: 500 }
    );
  }
}