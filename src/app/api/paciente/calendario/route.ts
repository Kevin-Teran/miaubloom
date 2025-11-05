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
    console.warn('Error al verificar JWT en API calendario:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

interface EmotionRecord {
  emocionPrincipal: string;
  nivelAfectacion: number;
  timestamp: Date;
}

interface DailyEmotions {
  [date: string]: Array<{
    emocion: string;
    afectacion: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Paciente') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 403 }
      );
    }

    const pacienteId = auth.userId;

    // Obtener todos los registros de emociones del paciente
    const registrosEmocionales = await prisma.registroEmocional.findMany({
      where: {
        pacienteId: pacienteId,
      },
      select: {
        emocionPrincipal: true,
        nivelAfectacion: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Agrupar emociones por fecha
    const registrosPorDia: DailyEmotions = {};

    registrosEmocionales.forEach((registro: EmotionRecord) => {
      // Formatear fecha como YYYY-MM-DD
      const fecha = new Date(registro.timestamp);
      const fechaStr = fecha.toISOString().split('T')[0];

      if (!registrosPorDia[fechaStr]) {
        registrosPorDia[fechaStr] = [];
      }

      // Procesar emociones (pueden estar separadas por comas)
      const emociones = (registro.emocionPrincipal || '')
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);

      emociones.forEach(emocion => {
        registrosPorDia[fechaStr].push({
          emocion,
          afectacion: registro.nivelAfectacion || 0,
        });
      });
    });

    // Obtener citas del paciente (si existe el modelo)
    interface CitaType {
      id: number;
      psicologoId: string;
      fechaHora: Date;
      detalles: string | null;
      estado: string;
    }
    let citas: CitaType[] = [];
    try {
      citas = await prisma.cita.findMany({
        where: {
          pacienteId: pacienteId,
        },
        select: {
          id: true,
          psicologoId: true,
          fechaHora: true,
          detalles: true,
          estado: true,
        },
        orderBy: {
          fechaHora: 'asc',
        },
      }) as CitaType[];
    } catch (e) {
      // Si el modelo Cita no existe, continuamos sin citas
      console.warn('Modelo Cita no disponible:', e instanceof Error ? e.message : String(e));
    }

    // Procesar citas por fecha
    const citasPorDia: { [date: string]: CitaType[] } = {};
    citas.forEach((cita: CitaType) => {
      const fechaStr = new Date(cita.fechaHora).toISOString().split('T')[0];
      if (!citasPorDia[fechaStr]) {
        citasPorDia[fechaStr] = [];
      }
      citasPorDia[fechaStr].push(cita);
    });

    return NextResponse.json({
      success: true,
      datosCalendario: {
        registrosPorDia,
        citasPorDia,
        totalEmociones: registrosEmocionales.length,
        totalCitas: citas.length,
      },
    });
  } catch (error) {
    console.error('Error en API calendario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
