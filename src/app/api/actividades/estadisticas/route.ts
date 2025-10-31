/**
 * @file route.ts
 * @route src/app/api/actividades/estadisticas/route.ts
 * @description API endpoint para obtener estadísticas de emociones del paciente
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmotionStats {
  nombre: string;
  porcentaje: number;
  color: string;
}

/**
 * Map de emociones a sus nombres y colores en el jardín
 */
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
 * @description Obtiene las estadísticas de emociones del paciente de los últimos 30 días
 * @param {NextRequest} request - Petición HTTP con cookie de sesión
 * @returns {Promise<NextResponse>} Estadísticas de emociones del paciente
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('miaubloom_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    // Obtener el perfil del paciente
    const pacienteProfile = await prisma.perfilPaciente.findUnique({
      where: { userId },
    });

    if (!pacienteProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de paciente no encontrado' },
        { status: 404 }
      );
    }

    // Calcular fecha hace 30 días
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    // Obtener registros emocionales de los últimos 30 días
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

    // Agregar emociones
    const emotionCounts: Record<string, number> = {};
    const emotionTotals: Record<string, number> = {};

    registros.forEach(registro => {
      const emociones = registro.emocionPrincipal.split(',').map(e => e.trim());
      
      emociones.forEach(emocion => {
        emotionCounts[emocion] = (emotionCounts[emocion] || 0) + 1;
        emotionTotals[emocion] = (emotionTotals[emocion] || 0) + registro.nivelAfectacion;
      });
    });

    // Calcular promedios y mapear a flores
    const emotionStats: Record<string, EmotionStats> = {};

    Object.entries(emotionCounts).forEach(([emocion, count]) => {
      const average = Math.round((emotionTotals[emocion] / count) * 10); // Porcentaje
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

        // Promediar si ya existe
        const current = emotionStats[flowerName].porcentaje;
        emotionStats[flowerName].porcentaje = Math.round((current + average) / 2);
      }
    });

    // Si no hay datos, retornar valores por defecto para demo
    const estadisticas = Object.values(emotionStats).length > 0 
      ? Object.values(emotionStats).slice(0, 3) // Top 3 emociones
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
