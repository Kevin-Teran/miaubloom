import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

async function getAuthPayload(request: NextRequest): Promise<{ userId: string; rol: string } | null> {
  const token = request.cookies.get('miaubloom_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { userId: payload.userId as string, rol: payload.rol as string };
  } catch (e) {
    console.warn('Error al verificar JWT:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

interface RegistroEmocionalBody {
  emocionPrincipal: string;
  nivelAfectacion: number;
  queOcurrio?: string;
  quePense?: string;
  queHice?: string;
  lugar?: string;
  pensamiento?: string;
  accion?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Paciente') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 403 }
      );
    }

    const pacienteId = auth.userId;
    const body: RegistroEmocionalBody = await request.json();

    // Validar campos requeridos
    if (!body.emocionPrincipal || body.nivelAfectacion === undefined) {
      return NextResponse.json(
        { success: false, message: 'Campos requeridos: emocionPrincipal, nivelAfectacion' },
        { status: 400 }
      );
    }

    // Validar que nivelAfectacion esté en rango 1-5
    if (body.nivelAfectacion < 1 || body.nivelAfectacion > 5) {
      return NextResponse.json(
        { success: false, message: 'nivelAfectacion debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    // Crear registro de emoción
    const createData = {
      pacienteId,
      emocionPrincipal: body.emocionPrincipal,
      nivelAfectacion: body.nivelAfectacion,
      queOcurrio: body.queOcurrio || '',
      quePense: body.quePense || '',
      queHice: body.queHice || '',
      lugar: body.lugar || '',
      timestamp: new Date(),
    };

    const registroCreado = await prisma.registroEmocional.create({
      data: createData,
    });

    return NextResponse.json({
      success: true,
      message: 'Emoción registrada exitosamente',
      registro: {
        id: registroCreado.id,
        emocionPrincipal: registroCreado.emocionPrincipal,
        nivelAfectacion: registroCreado.nivelAfectacion,
        timestamp: registroCreado.timestamp,
      },
    });
  } catch (error) {
    console.error('Error registrando emoción:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
