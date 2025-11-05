/**
 * @file route.ts
 * @route src/app/api/actividades/estadisticas/route.ts
 * @description API endpoint para estadísticas (ACTUALIZADO A JWT)
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose'; // <-- IMPORTAR JOSE

const prisma = new PrismaClient();

// --- LÓGICA DE AUTENTICACIÓN JWT REUTILIZABLE ---
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
    console.warn('Error al verificar JWT en API:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

interface EmotionStats {
  nombre: string;
  porcentaje: number;
  color: string;
}

const EMOTION_MAP: Record<string, { nombre: string; color: string }> = {
  'Felicidad': { nombre: 'Margarita', color: '#22D3EE' },
  'Alegría': { nombre: 'Margarita', color: '#22D3EE' },
  'Calma': { nombre: 'Girasol', color: '#FCD34D' },
  'Paz': { nombre: 'Girasol', color: '#FCD34D' },
  'Amor': { nombre: 'Rosa', color: '#EC4899' },
  'Cariño': { nombre: 'Rosa', color: '#EC4899' },
  'Ansiedad': { nombre: 'Cardo', color: '#C084FC' },
  'Miedo': { nombre: 'Cardo', color: '#C084FC' },
  'Tristeza': { nombre: 'Lavanda', color: '#A78BFA' },
  'Soledad': { nombre: 'Lavanda', color: '#A78BFA' },
  'Rabia': { nombre: 'Espina', color: '#F87171' },
  'Ira': { nombre: 'Espina', color: '#F87171' },
};

/**
 * @function GET
 * @description Obtiene las estadísticas (AHORA USA JWT)
 */
// --- INTERFAZ PARA ESTADÍSTICAS ---
interface EmotionRecord {
  emocionPrincipal: string;
  nivelAfectacion: number;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const auth = await getAuthPayload(request);
    if (!auth || auth.rol !== 'Paciente') {
      return NextResponse.json(
        { success: false, message: 'No autenticado o rol incorrecto' },
        { status: 401 }
      );
    }
    const userId = auth.userId;

    // 2. Obtener el perfil del paciente
    const pacienteProfile = await prisma.perfilPaciente.findUnique({
      where: { userId },
    });

    if (!pacienteProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de paciente no encontrado' },
        { status: 404 }
      );
    }

    // 3. Calcular fecha hace 30 días y obtener registros
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const registros = await prisma.registroEmocional.findMany({
      where: {
        pacienteId: pacienteProfile.userId,
        timestamp: {
          gte: hace30Dias,
        },
      },
      select: {
        emocionPrincipal: true,
        nivelAfectacion: true,
      },
    });

    // 4. Mapear y calcular estadísticas
    const emotionCounts: Record<string, number> = {};
    const emotionTotals: Record<string, number> = {};

    registros.forEach((registro: EmotionRecord) => {
      const emociones = registro.emocionPrincipal.split(',').map((e: string) => e.trim());
      
      emociones.forEach((emocion: string) => {
        emotionCounts[emocion] = (emotionCounts[emocion] || 0) + 1;
        emotionTotals[emocion] = (emotionTotals[emocion] || 0) + registro.nivelAfectacion;
      });
    });

    const emotionStats: Record<string, EmotionStats> = {};

    Object.entries(emotionCounts).forEach(([emocion, count]) => {
      const average = Math.round((emotionTotals[emocion] / count) * 10);
      const mappedEmotion = EMOTION_MAP[emocion];

      if (mappedEmotion) {
        const flowerName = mappedEmotion.nombre;

        if (!emotionStats[flowerName]) {
          emotionStats[flowerName] = {
            nombre: flowerName,
            porcentaje: 0,
            color: mappedEmotion.color,
          };
        }

        const current = emotionStats[flowerName].porcentaje;
        emotionStats[flowerName].porcentaje = Math.round((current + average) / 2);
      }
    });

    const estadisticas = Object.values(emotionStats).length > 0 
      ? Object.values(emotionStats).slice(0, 3) 
      : [
          { nombre: 'Margarita', porcentaje: 0, color: '#22D3EE' },
          { nombre: 'Girasol', porcentaje: 0, color: '#FCD34D' },
          { nombre: 'Cardo', porcentaje: 0, color: '#C084FC' },
        ];

    return NextResponse.json(
      {
        success: true,
        estadisticas,
        totalRegistros: registros.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
