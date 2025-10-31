import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware de protección de rutas por rol
 * Redirija automáticamente según el rol del usuario
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rutas públicas que no requieren redirección
  const publicRoutes = ['/identificacion', '/auth'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Obtener la cookie de sesión
  const sessionCookie = request.cookies.get('miaubloom_session');
  
  // Si no hay sesión, no hacer nada aquí (el cliente lo manejará)
  if (!sessionCookie) {
    return NextResponse.next();
  }

  // Rutas protegidas según rol
  const pacienteRoutes = ['/inicio/paciente', '/perfil/paciente', '/ajustes/paciente', '/chat/paciente', '/tareas'];
  const psicologoRoutes = ['/inicio/psicologo', '/perfil/psicologo', '/ajustes/psicologo', '/chat/psicologo'];
  
  // Si intenta acceder a rutas de paciente pero es psicólogo, redirigir al inicio del psicólogo
  if (pacienteRoutes.some(route => pathname.startsWith(route))) {
    // El hook en la página lo manejará
    return NextResponse.next();
  }
  
  // Si intenta acceder a rutas de psicólogo pero es paciente, redirigir al inicio del paciente
  if (psicologoRoutes.some(route => pathname.startsWith(route))) {
    // El hook en la página lo manejará
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
