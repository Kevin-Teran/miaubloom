import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

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
    interface CitaRawType {
      id: number;
      psicologoId: string;
      fechaHora: Date;
      detalles: string | null;
      estado: string;
      psicologo?: {
        user: {
          nombreCompleto: string;
        };
      };
    }
    let citas: CitaRawType[] = [];
    try {
      citas = await prisma.cita.findMany({
        where: {
          pacienteId: pacienteId,
        },
        include: {
          psicologo: {
            include: {
              user: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
        },
        orderBy: {
          fechaHora: 'asc',
        },
      });
    } catch (e) {
      // Si el modelo Cita no existe, continuamos sin citas
      console.warn('Modelo Cita no disponible:', e instanceof Error ? e.message : String(e));
    }

    // Procesar citas por fecha
    const citasPorDia: { [date: string]: CitaRawType[] } = {};
    citas.forEach((cita) => {
      const fechaStr = new Date(cita.fechaHora).toISOString().split('T')[0];
      if (!citasPorDia[fechaStr]) {
        citasPorDia[fechaStr] = [];
      }
      citasPorDia[fechaStr].push(cita);
    });

    // Formatear citas para el calendario
    const citasFormateadas = citas.map((cita) => {
      const fechaHora = new Date(cita.fechaHora);
      const psicologoNombre = cita.psicologo?.user?.nombreCompleto || 'Psicólogo';
      return {
        id: cita.id.toString(),
        psicologoId: cita.psicologoId,
        psicologoNombre: psicologoNombre,
        psicologo: {
          nombreCompleto: psicologoNombre,
        },
        fechaHoraInicio: cita.fechaHora.toISOString(),
        fecha: fechaHora.toISOString().split('T')[0],
        hora: fechaHora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        estado: cita.estado,
        detalles: cita.detalles,
      };
    });

    // Si se solicita formato de calendario (citas), devolver ese formato
    const url = new URL(request.url);
    const formato = url.searchParams.get('formato');
    
    if (formato === 'citas' || !formato) {
      return NextResponse.json({
        success: true,
        citas: citasFormateadas,
      });
    }

    // Formato completo con emociones
    return NextResponse.json({
      success: true,
      datosCalendario: {
        registrosPorDia,
        citasPorDia,
        totalEmociones: registrosEmocionales.length,
        totalCitas: citas.length,
      },
      citas: citasFormateadas,
    });
  } catch (error) {
    console.error('Error en API calendario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
}
}
