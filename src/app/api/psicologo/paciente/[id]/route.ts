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
    console.warn('Error al verificar JWT en API paciente por id:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

interface EmotionRecord {
  emocionPrincipal: string;
  nivelAfectacion: number;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pacienteId } = await params;
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Psicólogo') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
    }

    if (!pacienteId) {
      return NextResponse.json({ success: false, message: 'ID de paciente requerido' }, { status: 400 });
    }

    // Obtener datos del paciente
    const user = await prisma.user.findUnique({
      where: { id: pacienteId },
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        perfilPaciente: {
          select: {
            fotoPerfil: true,
            nicknameAvatar: true,
            fechaNacimiento: true,
            genero: true,
            horarioUso: true,
            duracionUso: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Paciente no encontrado' }, { status: 404 });
    }

    // Calcular fecha hace 30 días y obtener registros
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const registros = await prisma.registroEmocional.findMany({
      where: {
        pacienteId: pacienteId,
        timestamp: { gte: hace30Dias },
      },
      select: {
        emocionPrincipal: true,
        nivelAfectacion: true,
      },
    });

    // Mapear y calcular estadísticas
    const emotionCounts: Record<string, number> = {};
    const emotionTotals: Record<string, number> = {};

    registros.forEach((registro: EmotionRecord) => {
      const emociones = (registro.emocionPrincipal || '').split(',').map(e => e.trim()).filter(Boolean);
      emociones.forEach((emocion: string) => {
        emotionCounts[emocion] = (emotionCounts[emocion] || 0) + 1;
        emotionTotals[emocion] = (emotionTotals[emocion] || 0) + (registro.nivelAfectacion || 0);
      });
    });

    const estadisticasEmocionales = Object.keys(emotionCounts).map((name, idx) => {
      const count = emotionCounts[name] || 0;
      const total = emotionTotals[name] || 0;
      const avg = count > 0 ? Math.round((total / count) * 100) / 100 : 0;
      const colors = ['#F87171', '#FB923C', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'];
      return {
        nombre: name,
        cantidad: count,
        promedioNivelAfectacion: avg,
        color: colors[idx % colors.length],
      };
    });

    const pacienteResponse = {
      id: user.id,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      perfil: user.perfilPaciente || null,
    };

    return NextResponse.json({
      success: true,
      paciente: pacienteResponse,
      diagnostico: 'Diagnóstico: 6 meses',
      estadisticasEmocionales,
    });

  } catch (error) {
    console.error('Error en API paciente por id:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
