/**
 * @file route.ts
 * @route src/app/api/auth/dev-login/route.ts
 * @description Endpoint de login para desarrollo (bypass de autenticación)
 * @author Kevin Mariano
 * @version 2.0.0 (CORREGIDO - SETEA COOKIE)
 */

import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function GET() {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_BYPASS_AUTH !== 'true') {
    return NextResponse.json(
      { success: false, message: 'No disponible en producción' },
      { status: 403 }
    );
  }

  // Usuario de prueba: Dr. Martínez (Psicólogo)
  const mockUser = {
    id: 'eab85af6-cb93-4a71-89d7-01905db305a6',
    email: 'dr.martinez@miaubloom.com',
    nombreCompleto: 'Dr. Carlos Martínez',
    rol: 'Psicólogo',
    perfilCompleto: true,
  };

  try {
    // Crear JWT
    const payload = {
      userId: mockUser.id,
      email: mockUser.email,
      rol: mockUser.rol,
      nombreCompleto: mockUser.nombreCompleto,
      genero: 'Masculino',
      especialidad: 'Psicología Infantil',
      numeroRegistro: 'PSI-2024-002',
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    console.log('[DEV-LOGIN] Autenticación de desarrollo activada');

    // --- CORRECCIÓN: SETEAR COOKIE ---
    const response = NextResponse.json({
      success: true,
      token, // Aún lo devolvemos por si el cliente quiere usarlo
      user: mockUser,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false, // En desarrollo siempre es false
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    return response;
    // --- FIN CORRECCIÓN ---

  } catch (error) {
    console.error('[DEV-LOGIN] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error en dev-login' },
      { status: 500 }
    );
  }
}
