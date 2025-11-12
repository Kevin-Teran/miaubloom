/**
 * @file middleware.ts
 * @route src/middleware.ts
 * @description Middleware para proteger rutas y validar JWT en el servidor
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Clave secreta para VERIFICAR el token. DEBE SER LA MISMA que usas en login/register.
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

// Función para verificar el JWT (la cookie de sesión)
async function verifyAuth(token: string): Promise<Record<string, unknown> | null> {
  if (!token) {
    return null;
  }
  try {
    // La clave secreta se usa aquí
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as Record<string, unknown>; // Devuelve el { userId, rol, ... }
  } catch (err) {
    console.warn('Verificación de JWT fallida:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Buscar la cookie correcta: auth_token
  const sessionToken = request.cookies.get('auth_token')?.value;

  // Verificar si hay token válido
  let isAuthenticated = false;
  let userRole: string | undefined;

  if (sessionToken) {
    const payload = await verifyAuth(sessionToken);
    if (payload) {
      isAuthenticated = true;
      userRole = payload.rol as string;
    }
  }

  // Rutas públicas que NO requieren auimage.pngtenticación
  const publicRoutes = ['/', '/identificacion', '/bienvenido', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route) || pathname === route);

  // Si es ruta pública
  if (isPublicRoute) {
    // Si está logueado y va a auth/login/register, redirigir a su dashboardla id
    if (isAuthenticated && pathname.startsWith('/auth')) {
      const dashboardUrl = userRole === 'Paciente' ? '/inicio/paciente' : '/inicio/psicologo';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    // Permitir acceso a rutas públicas
    return NextResponse.next();
  }
  // Si la ruta NO es pública, requiere autenticación
  // Si NO hay token válido, redirigir a /identificacion
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/identificacion', request.url));
  }

  // Si llegó aquí, está autenticado. Permitir acceso
  return NextResponse.next();
}

// Configuración del Matcher
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto las que son para archivos estáticos,
     * API, imágenes, o rutas internas de Next.js.
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json|icons/).*)',
  ],
};
