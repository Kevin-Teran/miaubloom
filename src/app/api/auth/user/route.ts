/**
 * @file route.ts
 * @route src/app/api/auth/user/route.ts
 * @description API endpoint para obtener datos de usuario. AHORA LEE DESDE COOKIE.
 * @author Kevin Mariano
 * @version 2.0.0 (CORREGIDO)
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload, SECRET_KEY } from '@/lib/auth';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

/**
 * @function GET
 * @description Obtiene los datos completos del usuario autenticado (LEYENDO DESDE COOKIE)
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Datos del usuario con perfil completo
 */
export async function GET(request: NextRequest) {
  try {
    // --- CORRECCIÓN CRÍTICA: LEER DE COOKIE ---
    const sessionToken = request.cookies.get('miaubloom_session')?.value;
    // --- FIN DE CORRECCIÓN ---

    console.log('[AUTH/USER] Verificando sesión desde cookie:', {
      hasSessionToken: !!sessionToken,
    });

    if (!sessionToken) {
      console.log('[AUTH/USER] No hay cookie de sesión');
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'No hay sesión activa' 
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
          }
        }
      );
    }

    // Verificar el JWT
    let payload: Record<string, unknown>;
    let userId: string;
    let userRole: string;

    try {
      const { payload: decodedPayload } = await jwtVerify(sessionToken, SECRET_KEY);
      payload = decodedPayload as Record<string, unknown>;
      userId = payload.userId as string;
      userRole = payload.rol as string;
      
      if (!userId || !userRole) {
        throw new Error('Payload de JWT inválido');
      }

    } catch (error) {
      console.error('[AUTH/USER] Error al verificar JWT:', error);
      // Devolver 401 para que el cliente sepa que la cookie es inválida
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          message: 'Sesión inválida o expirada' 
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

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
          message: 'Usuario no encontrado' 
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          }
        }
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

    // Devolver la estructura de usuario unificada
    return NextResponse.json(
      { 
        success: true, 
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
          perfil: perfilData, // Enviar el objeto de perfil completo
          perfilCompleto: perfilCompleto
        }
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        message: 'Error al obtener usuario' 
      },
      { status: 500 }
    );
}
}
