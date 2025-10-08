// project/src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// POST /api/auth/logout
export async function POST() {
  try {
    const session = await getSession();

    // Destruye la sesión
    session.destroy();

    return NextResponse.json({ message: 'Sesión cerrada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}