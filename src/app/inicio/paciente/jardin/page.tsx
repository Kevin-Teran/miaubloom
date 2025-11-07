"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Link from 'next/link';

interface DailyEmotions {
  [date: string]: Array<{
    emocion: string;
    afectacion: number;
  }>;
}

interface CitaData {
  id: number;
  psicologoId: string;
  fechaHora: Date;
  detalles: string | null;
  estado: string;
}

interface CalendarResponse {
  success: boolean;
  datosCalendario: {
    registrosPorDia: DailyEmotions;
    citasPorDia: { [date: string]: CitaData[] };
    totalEmociones: number;
    totalCitas: number;
  };
}

export default function JardinPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<DailyEmotions>({});
  const [citasData, setCitasData] = useState<{ [date: string]: CitaData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manejar cambio de fecha del calendario
  const handleDateChange = (value: unknown) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Cargar datos del calendario
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/paciente/calendario', {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError('No tienes permiso para acceder a esta página');
          } else {
            setError('Error al cargar los datos del calendario');
          }
          setLoading(false);
          return;
        }

        const data: CalendarResponse = await response.json();

        if (data.success) {
          setCalendarData(data.datosCalendario.registrosPorDia);
          setCitasData(data.datosCalendario.citasPorDia);
        } else {
          setError('Error al procesar los datos');
        }
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Error de conexión al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  // Función para obtener la fecha formateada
  const getFormattedDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Obtener emociones del día seleccionado
  const selectedDateStr = getFormattedDate(selectedDate);
  const emotionesDelDia = calendarData[selectedDateStr] || [];
  const citasDelDia = citasData[selectedDateStr] || [];

  // Agrupar emociones por tipo y calcular promedio
  const emocionesAgrupadas: { [key: string]: { total: number; count: number; color: string } } = {};
  const colorMap: { [key: string]: string } = {
    'Alegría': '#FFD700',
    'Tristeza': '#87CEEB',
    'Ansiedad': '#FF6347',
    'Calma': '#90EE90',
    'Frustración': '#FF8C00',
    'Amor': '#FF69B4',
  };

  emotionesDelDia.forEach(item => {
    if (!emocionesAgrupadas[item.emocion]) {
      emocionesAgrupadas[item.emocion] = {
        total: 0,
        count: 0,
        color: colorMap[item.emocion] || '#A0A0A0',
      };
    }
    emocionesAgrupadas[item.emocion].total += item.afectacion;
    emocionesAgrupadas[item.emocion].count += 1;
  });

  // Calcular promedios
  const emocionesPromedio = Object.entries(emocionesAgrupadas).map(([nombre, data]) => ({
    nombre,
    promedio: Math.round((data.total / data.count) * 100) / 100,
    porcentaje: Math.min(Math.round((data.total / data.count) * 10), 100),
    color: data.color,
  }));

  // Renderizar días con decoración de flores en el calendario
  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasEmociones = calendarData[dateStr];
    
    if (hasEmociones && hasEmociones.length > 0) {
      return (
        <div className="flex justify-center">
          <span className="text-lg">🌼</span>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff]">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-md max-w-md">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[var(--color-theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-[var(--color-theme-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">Volver</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">Mi Jardín Emocional</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Sección del Calendario */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendario</h2>
          <style jsx>{`
            :global(.react-calendar) {
              width: 100%;
              max-width: 100%;
              background: transparent;
              border: none;
              font-family: inherit;
            }
            :global(.react-calendar__tile) {
              padding: 8px;
              border-radius: 8px;
              font-size: 14px;
            }
            :global(.react-calendar__tile--active) {
              background-color: #f1a8a9;
              color: white;
            }
            :global(.react-calendar__tile:hover) {
              background-color: #f0f0f0;
            }
          `}</style>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full"
          />
        </div>

        {/* Tarjeta de Emociones del Día */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Emociones del {selectedDateStr ? new Date(selectedDateStr).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'día'}
          </h2>

          {emocionesPromedio.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay emociones registradas para este día.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {emocionesPromedio.map(emocion => (
                <div key={emocion.nombre} className="flex flex-col items-center">
                  {/* Círculo de progreso */}
                  <div className="relative w-20 h-20 mb-2">
                    <svg className="w-20 h-20 transform -rotate-90">
                      {/* Círculo de fondo */}
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#E5E7EB"
                        strokeWidth="6"
                        fill="none"
                      />
                      {/* Círculo de progreso */}
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={emocion.color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${(emocion.porcentaje / 100) * (2 * Math.PI * 36)} ${2 * Math.PI * 36}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Porcentaje en el centro */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">
                        {emocion.porcentaje}%
                      </span>
                    </div>
                  </div>

                  {/* Nombre de la emoción */}
                  <span className="text-sm font-medium text-gray-600 text-center">
                    {emocion.nombre}
                  </span>

                  {/* Valor de afectación */}
                  <span className="text-xs text-gray-500 mt-1">
                    {emocion.promedio.toFixed(1)}/5
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tarjeta de Citas */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Citas pendientes
          </h2>

          {citasDelDia.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay citas programadas para este día.
            </p>
          ) : (
            <div className="space-y-3">
              {citasDelDia.map(cita => (
                <div
                  key={cita.id}
                  className="border-l-4 border-[var(--color-theme-primary)] bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Cita con psicólogo
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {cita.detalles || 'Sin detalles'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          ⏰ {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          cita.estado === 'Programada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-md p-4 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wide">
              Total de Emociones
            </p>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {emotionesDelDia.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-4 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-wide">
              Citas del Día
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {citasDelDia.length}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Navegación Inferior (Reutilizada) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around items-center py-3 px-4">
          <Link
            href="/inicio/paciente"
            className="flex flex-col items-center text-gray-400 hover:text-[var(--color-theme-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l-4-4m0 0L5 3m4 4L3 3"
              />
            </svg>
            <span className="text-xs mt-1">Inicio</span>
          </Link>

          <Link
            href="/inicio/paciente/jardin"
            className="flex flex-col items-center text-[var(--color-theme-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
            </svg>
            <span className="text-xs mt-1">Jardín</span>
          </Link>

          <Link
            href="/perfil/paciente"
            className="flex flex-col items-center text-gray-400 hover:text-[var(--color-theme-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
