// project/src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Role } from '@prisma/client';

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    // 1. Buscar usuario en la base de datos (Prisma/MySQL)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario o contraseña inválidos' }, { status: 401 });
    }

    // 2. Verificar la contraseña con bcrypt
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Usuario o contraseña inválidos' }, { status: 401 });
    }

    // 3. Crear la sesión segura (Iron Session)
    const session = await getSession();
    const sessionUser = {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      onboarding_completed: user.onboarding_completed,
      full_name: user.full_name,
    };

    session.user = sessionUser;
    await session.save();

    // 4. Determinar la ruta de redirección
    const redirectUrl = user.onboarding_completed 
      ? `/dashboard/${user.role}` 
      : `/onboarding/welcome`; // Ruta de onboarding inicial (ajustar según la app)

    return NextResponse.json({ user: sessionUser, redirectUrl }, { status: 200 });

  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}