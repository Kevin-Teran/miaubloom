import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// --- LÓGICA DE AUTENTICACIÓN JWT ---
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

async function getAuthPayload(request: NextRequest): Promise<{ userId: string; rol: string } | null> {
  const token = request.cookies.get('miaubloom_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { userId: payload.userId as string, rol: payload.rol as string };
  } catch {
    return null;
  }
}
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

/**
 * @function POST
 * @description Crea una nueva cuenta de Paciente y la asigna al psicólogo autenticado.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      email,
      password,
      nombreCompleto,
      day,
      month,
      year,
      genero,
    } = body;

    // 1. Validación de datos básicos
    if (!email || !password || !nombreCompleto || !day || !month || !year || !genero) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos básicos del paciente' },
        { status: 400 }
      );
    }

    // 2. Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Este correo electrónico ya está registrado' },
        { status: 409 }
      );
    }

    // 3. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Crear usuario y perfil en una transacción
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          nombreCompleto: nombreCompleto.trim(),
          rol: 'Paciente',
        },
      });

      const fechaNacimiento = new Date(
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      );

      // Datos por defecto que el paciente puede cambiar luego
      const defaultData = {
        contactoEmergencia: 'No definido',
        institucionReferida: 'Privada',
        nicknameAvatar: nombreCompleto.split(' ')[0] || 'Nikky01',
        fotoPerfil: '/assets/avatar-paciente.png',
        horarioUso: '8-14',
        duracionUso: '8-14',
      };

      await tx.perfilPaciente.create({
        data: {
          userId: user.id,
          fechaNacimiento,
          genero,
          ...defaultData,
          // ¡ASIGNACIÓN DIRECTA!
          psicologoAsignadoId: auth.userId,
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Paciente creado y asignado exitosamente',
        user: newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
