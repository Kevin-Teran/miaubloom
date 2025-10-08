// project/src/app/api/auth/user/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// GET /api/auth/user
export async function GET() {
  try {
    const session = await getSession();

    if (!session.user) {
      // Si no hay usuario en sesión, devuelve null
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Devuelve los datos de sesión limpios
    return NextResponse.json({ user: session.user }, { status: 200 });

  } catch (error) {
    // Esto captura errores de deserialización o configuración de Iron Session
    return NextResponse.json({ error: 'Error al obtener sesión' }, { status: 500 });
  }
}