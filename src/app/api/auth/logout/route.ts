// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// No necesitas importar 'cookies' de 'next/headers' aquí

/**
 * @file route.ts
 * @route src/app/api/auth/logout/route.ts
 * @description API endpoint para cerrar la sesión del usuario eliminando la cookie.
 * @author Kevin Mariano
 * @version 1.1.0 // Versión actualizada
 * @since 1.0.0
 * @copyright MiauBloom
 */

/**
 * @function POST
 * @description Maneja la solicitud de cierre de sesión eliminando la cookie httpOnly.
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta JSON indicando éxito o error.
 */
export async function POST(request: NextRequest) {
  try {
    // Leer la cookie DESDE el request
    const sessionCookie = request.cookies.get('auth_token'); //

    if (!sessionCookie) {
      console.log("Logout: No session cookie found to delete.");
      return NextResponse.json({ success: true, message: 'No hay sesión activa.' }, { status: 200 });
    }

    // Crear la respuesta ANTES de enviarla
    const response = NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente.' }, { status: 200 });

    // Borrar la cookie en la respuesta que se enviará al cliente
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: -1, // Expira inmediatamente
    }); //

    console.log("Logout: Session cookie deleted successfully.");
    return response;

  } catch (error) {
    console.error('Error in API logout route:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor al cerrar sesión.' },
      { status: 500 }
    );
  }
}

/**
 * @function GET
 * @description Maneja intentos GET (no permitidos).
 * @param {NextRequest} request - Petición HTTP
 * @returns {Promise<NextResponse>} Respuesta de error 405.
 */
export async function GET(request: NextRequest) {
   // El parámetro 'request' se usa, por lo que la advertencia desaparecerá.
   const host = request.nextUrl.host;
   console.log(`GET attempt to /api/auth/logout from ${host}`);
   return NextResponse.json({ success: false, message: 'Método no permitido. Utilice POST para cerrar sesión.' }, { status: 405 });
}