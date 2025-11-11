"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, MessageCircle, Home, Plus, User, ChevronUp, ChevronDown } from 'lucide-react';

interface EmotionRecord {
  emocion: string;
  afectacion: number;
}

interface CitaData {
  id: number;
  psicologoId: string;
  psicologoNombre: string;
  fechaHora: Date;
  detalles: string | null;
  estado: string;
}

interface CalendarResponse {
  success: boolean;
  datosCalendario?: {
    registrosPorDia: { [date: string]: EmotionRecord[] };
    citasPorDia: { [date: string]: CitaData[] };
    totalEmociones: number;
    totalCitas: number;
  };
}

// Colores para emociones
const emotionColors: { [key: string]: { color: string; bg: string } } = {
  'Margarita': { color: '#D8A5D0', bg: '#F5E6F0' },
  'Girasol': { color: '#87CEEB', bg: '#E0F6FF' },
  'Cardo': { color: '#F4D03F', bg: '#FFF9E6' },
  'Stress': { color: '#5B9BD5', bg: '#E3F2FD' },
  'Miedo': { color: '#70AD47', bg: '#E8F5E9' },
  'Cansancio': { color: '#FFC000', bg: '#FFF8E1' },
  'Alegría': { color: '#FF6B6B', bg: '#FFE0E0' },
  'Tristeza': { color: '#4A90E2', bg: '#E3F2FD' },
  'Tranquilidad': { color: '#70AD47', bg: '#E8F5E9' },
  'Energía': { color: '#FFC000', bg: '#FFF8E1' },
};

// Función para obtener colores según género
const getThemeColors = (genero?: string) => {
  if (genero?.toLowerCase() === 'masculino') {
    return {
      primary: '#93C5FD', // Azul claro
      primaryLight: '#DBEAFE', // Azul muy claro
      primaryDark: '#3B82F6', // Azul
      gradient: 'from-[#DBEAFE] to-[#BFDBFE]',
      gradientBg: 'bg-gradient-to-b from-[#DBEAFE] to-[#BFDBFE]'
    };
  }
  // Por defecto rosa (femenino u otro)
  return {
    primary: '#F2C2C1',
    primaryLight: '#FFF5F5',
    primaryDark: '#F5B8B7',
    gradient: 'from-[#FFF5F5] to-[#F2C2C1]',
    gradientBg: 'bg-gradient-to-b from-[#FFF5F5] to-[#F2C2C1]'
  };
};

export default function JardinPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<{ [date: string]: EmotionRecord[] }>({});
  const [citasData, setCitasData] = useState<{ [date: string]: CitaData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener colores del tema según género del usuario
  const themeColors = getThemeColors(user?.perfil?.genero);

  // Cargar datos del calendario
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/paciente/calendario?formato=completo', {
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

        if (data.success && data.datosCalendario) {
          setCalendarData(data.datosCalendario.registrosPorDia || {});
          setCitasData(data.datosCalendario.citasPorDia || {});
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

  // Obtener semana actual
  const getWeekDays = (date: Date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      weekDays.push({
        date: new Date(day),
        day: day.getDate(),
        dayName: day.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays(new Date());

  const getFormattedDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateStr = getFormattedDate(selectedDate);
  const emotionesDelDia = calendarData[selectedDateStr] || [];
  const citasDelDia = citasData[selectedDateStr] || [];

  const handleDayClick = (date: Date) => {
    setSelectedDate(new Date(date));
  };

  const hasDayData = (date: Date): boolean => {
    const dateStr = getFormattedDate(date);
    return calendarData[dateStr]?.length > 0 || citasData[dateStr]?.length > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{
        background: `linear-gradient(to bottom, ${themeColors.primaryLight}, rgba(255,255,255,0.5), white)`
      }}>
        <LoadingIndicator text="Cargando tu jardín..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      {/* ============ MOBILE VERSION ============ */}
      <div className="lg:hidden">
        {/* Sección superior - Jardín Digital */}
        <div className="relative h-96 pt-3 pb-4 overflow-hidden" style={{
          background: `linear-gradient(to bottom, ${themeColors.primaryLight}, ${themeColors.primaryDark}20)`
        }}>
          {/* SVG del jardín con grid y parcelas */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 375 340" preserveAspectRatio="xMidYMid slice">
            {/* Fondo base */}
            <rect width="375" height="340" fill="#A6C48A"/>
            
            {/* Grid de cuadrícula */}
            <defs>
              <pattern id="gridMobile" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6E8759" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="375" height="280" fill="url(#gridMobile)"/>
            
            {/* Parcelas con alternancia de colores - 8 columnas x 7 filas */}
            {/* Row 1 */}
            <rect x="10" y="10" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="55" y="10" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="100" y="10" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="145" y="10" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="190" y="10" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="235" y="10" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="280" y="10" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="325" y="10" width="40" height="40" fill="#D3B4E4" rx="2"/>
            
            {/* Row 2 */}
            <rect x="10" y="55" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="55" y="55" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="100" y="55" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="145" y="55" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="190" y="55" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="235" y="55" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="280" y="55" width="40" height="40" fill="#D3B4E4" rx="2"/>
            <rect x="325" y="55" width="40" height="40" fill="#5B3B25" rx="2"/>
            
            {/* Row 3 */}
            <rect x="10" y="100" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="55" y="100" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="100" y="100" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="145" y="100" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="190" y="100" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="235" y="100" width="40" height="40" fill="#D3B4E4" rx="2"/>
            <rect x="280" y="100" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="325" y="100" width="40" height="40" fill="#7DC383" rx="2"/>
            
            {/* Row 4 */}
            <rect x="10" y="145" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="55" y="145" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="100" y="145" width="40" height="40" fill="#D3B4E4" rx="2"/>
            <rect x="145" y="145" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="190" y="145" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="235" y="145" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="280" y="145" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="325" y="145" width="40" height="40" fill="#5B3B25" rx="2"/>
            
            {/* Row 5 */}
            <rect x="10" y="190" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="55" y="190" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="100" y="190" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="145" y="190" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="190" y="190" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="235" y="190" width="40" height="40" fill="#D3B4E4" rx="2"/>
            <rect x="280" y="190" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="325" y="190" width="40" height="40" fill="#A6E4C4" rx="2"/>
            
            {/* Row 6 */}
            <rect x="10" y="235" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="55" y="235" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="100" y="235" width="40" height="40" fill="#D3B4E4" rx="2"/>
            <rect x="145" y="235" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="190" y="235" width="40" height="40" fill="#7DC383" rx="2"/>
            <rect x="235" y="235" width="40" height="40" fill="#5B3B25" rx="2"/>
            <rect x="280" y="235" width="40" height="40" fill="#A6E4C4" rx="2"/>
            <rect x="325" y="235" width="40" height="40" fill="#5B3B25" rx="2"/>
            
            {/* Avatar central */}
            <circle cx="187" cy="105" r="20" fill="#CFAF92" opacity="0.9"/>
            <circle cx="187" cy="105" r="18" fill="none" stroke="#A89070" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Casita decorativa (esquina inferior izquierda) */}
            <rect x="15" y="250" width="45" height="35" fill="#B38A6D" rx="2"/>
            <polygon points="15,250 37.5,230 60,250" fill="#8B6F47"/>
            <rect x="30" y="265" width="10" height="12" fill="#654321"/>
            
            {/* Rocas decorativas (esquina derecha) */}
            <circle cx="320" cy="260" r="10" fill="#CFC9E4" opacity="0.7"/>
            <circle cx="340" cy="270" r="8" fill="#D3B4E4" opacity="0.8"/>
            <circle cx="360" cy="255" r="9" fill="#CFC9E4" opacity="0.6"/>
            
            {/* Vegetación decorativa */}
            <circle cx="8" cy="290" r="6" fill="#7DC383" opacity="0.5"/>
            <circle cx="25" cy="305" r="5" fill="#A6E4C4" opacity="0.6"/>
          </svg>

          {/* Contenido flotante */}
          <div className="absolute inset-0 z-20 px-4 pt-3 flex justify-between items-start pointer-events-none">
            {/* Iconos flotantes */}
            <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:shadow-xl transition-all active:scale-95 pointer-events-auto">
              <Menu size={24} />
            </button>
            <button 
              onClick={() => router.push('/chat')}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:shadow-xl transition-all active:scale-95 pointer-events-auto"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </div>

        {/* Panel blanco - Calendario y Emociones */}
        <div className="relative -mt-2 mx-4 bg-white rounded-3xl shadow-2xl p-6 space-y-6 z-20 mb-2">
          {/* Días de la semana */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Días de la semana</h3>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const isSelected = day.date.toDateString() === selectedDate.toDateString();
                const hasData = hasDayData(day.date);

                return (
                  <button
                    key={idx}
                    onClick={() => handleDayClick(day.date)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                      isSelected
                        ? 'shadow-lg'
                        : hasData
                        ? 'bg-yellow-200'
                        : 'hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColors.primary : undefined
                    }}
                  >
                    <span className="text-xs font-bold text-gray-600">{day.dayName}</span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {day.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emociones del día */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Emociones del día</h3>

            {emotionesDelDia.length > 0 ? (
              <div className="space-y-4">
                {emotionesDelDia.map((emocion, idx) => {
                  const emotionInfo = emotionColors[emocion.emocion] || { 
                    color: '#999', 
                    bg: '#F0F0F0' 
                  };
                  const porcentaje = Math.round((emocion.afectacion / 10) * 100);

                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800 text-sm">
                          {emocion.emocion}
                        </span>
                        <span className="text-xs font-bold" style={{ color: emotionInfo.color }}>
                          {porcentaje}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${porcentaje}%`,
                            backgroundColor: emotionInfo.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                No hay emociones registradas para este día.
              </p>
            )}
          </div>

          {/* Citas pendientes */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Citas pendientes</h3>

            {citasDelDia.length > 0 ? (
              <div className="space-y-3">
                {citasDelDia.map((cita, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border-2"
                    style={{
                      backgroundColor: `${themeColors.primaryLight}40`,
                      borderColor: themeColors.primary,
                    }}
                  >
                    <p className="font-semibold text-gray-800 text-sm">
                      {cita.psicologoNombre}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                No hay citas programadas para este día.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl z-50">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <Link
              href="/inicio/paciente/jardin"
              className="flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{ color: themeColors.primary }}
            >
              <Home size={24} />
              <span className="text-xs font-semibold">Jardín</span>
            </Link>
            <Link
              href="/inicio/paciente"
              className="flex flex-col items-center gap-1 text-gray-600 transition-all active:scale-95"
            >
              <Home size={24} />
              <span className="text-xs font-semibold">Inicio</span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 text-gray-600 transition-all active:scale-95"
            >
              <MessageCircle size={24} />
              <span className="text-xs font-semibold">Chat</span>
            </Link>
            <Link
              href="/perfil/paciente"
              className="flex flex-col items-center gap-1 text-gray-600 transition-all active:scale-95"
            >
              <User size={24} />
              <span className="text-xs font-semibold">Perfil</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* ============ DESKTOP VERSION ============ */}
      <div className="hidden lg:block">
        {/* Header Desktop */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Mi Jardín Emocional</h1>
            <div className="flex items-center gap-3">
              {/* Chat */}
              <button
                onClick={() => router.push('/chat')}
                className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-colors flex items-center gap-2 active:scale-95"
              >
                <MessageCircle size={18} />
                Chat
              </button>
              
              {/* Perfil */}
              <button
                onClick={() => router.push('/perfil/paciente')}
                className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-colors flex items-center gap-2 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </button>
              
              {/* Volver */}
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center gap-2 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
            </div>
          </div>
        </header>

        {/* Sección superior - Jardín Digital */}
        <div className="relative h-[calc(100vh-80px)] pt-6 pb-8 overflow-hidden" style={{
          background: `linear-gradient(to bottom, ${themeColors.primaryLight}, ${themeColors.primaryDark}20)`
        }}>
          {/* SVG del jardín con grid y parcelas */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 550" preserveAspectRatio="xMidYMid slice">
            {/* Fondo base */}
            <rect width="1600" height="550" fill="#A6C48A"/>
            
            {/* Grid de cuadrícula */}
            <defs>
              <pattern id="gridDesktop" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6E8759" strokeWidth="0.75" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="1600" height="450" fill="url(#gridDesktop)"/>
            
            {/* Parcelas - Grid 12x7 centrado con 50px cada una */}
            {/* Row 1 */}
            <rect x="500" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="555" y="20" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="610" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="665" y="20" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="720" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="775" y="20" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="830" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="885" y="20" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="940" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="995" y="20" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="1050" y="20" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1105" y="20" width="50" height="50" fill="#A6E4C4" rx="2"/>
            
            {/* Row 2 */}
            <rect x="500" y="75" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="555" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="610" y="75" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="665" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="720" y="75" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="775" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="830" y="75" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="885" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="940" y="75" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="995" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1050" y="75" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="1105" y="75" width="50" height="50" fill="#5B3B25" rx="2"/>
            
            {/* Row 3 */}
            <rect x="500" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="555" y="130" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="610" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="665" y="130" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="720" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="775" y="130" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="830" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="885" y="130" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="940" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="995" y="130" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="1050" y="130" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1105" y="130" width="50" height="50" fill="#7DC383" rx="2"/>
            
            {/* Row 4 */}
            <rect x="500" y="185" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="555" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="610" y="185" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="665" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="720" y="185" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="775" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="830" y="185" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="885" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="940" y="185" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="995" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1050" y="185" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="1105" y="185" width="50" height="50" fill="#5B3B25" rx="2"/>
            
            {/* Row 5 */}
            <rect x="500" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="555" y="240" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="610" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="665" y="240" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="720" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="775" y="240" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="830" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="885" y="240" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="940" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="995" y="240" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="1050" y="240" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1105" y="240" width="50" height="50" fill="#D3B4E4" rx="2"/>
            
            {/* Row 6 */}
            <rect x="500" y="295" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="555" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="610" y="295" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="665" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="720" y="295" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="775" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="830" y="295" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="885" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="940" y="295" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="995" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1050" y="295" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="1105" y="295" width="50" height="50" fill="#5B3B25" rx="2"/>
            
            {/* Row 7 */}
            <rect x="500" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="555" y="350" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="610" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="665" y="350" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="720" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="775" y="350" width="50" height="50" fill="#D3B4E4" rx="2"/>
            <rect x="830" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="885" y="350" width="50" height="50" fill="#A6E4C4" rx="2"/>
            <rect x="940" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="995" y="350" width="50" height="50" fill="#7DC383" rx="2"/>
            <rect x="1050" y="350" width="50" height="50" fill="#5B3B25" rx="2"/>
            <rect x="1105" y="350" width="50" height="50" fill="#D3B4E4" rx="2"/>
            
            {/* Avatar central */}
            <circle cx="800" cy="180" r="40" fill="#CFAF92" opacity="0.9"/>
            <circle cx="800" cy="180" r="37" fill="none" stroke="#A89070" strokeWidth="2" opacity="0.6"/>
            
            {/* Casita decorativa (esquina inferior izquierda) */}
            <rect x="20" y="380" width="70" height="55" fill="#B38A6D" rx="3"/>
            <polygon points="20,380 55,345 90,380" fill="#8B6F47"/>
            <rect x="45" y="400" width="15" height="18" fill="#654321"/>
            
            {/* Rocas decorativas (esquina derecha) */}
            <circle cx="1480" cy="380" r="25" fill="#CFC9E4" opacity="0.7"/>
            <circle cx="1530" cy="400" r="20" fill="#D3B4E4" opacity="0.8"/>
            <circle cx="1560" cy="370" r="22" fill="#CFC9E4" opacity="0.6"/>
            
            {/* Vegetación decorativa */}
            <circle cx="10" cy="450" r="12" fill="#7DC383" opacity="0.5"/>
            <circle cx="40" cy="475" r="10" fill="#A6E4C4" opacity="0.6"/>
          </svg>

        </div>

        {/* Panel blanco - Calendario y Emociones */}
        <div className="relative -mt-20 mx-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-12 space-y-8 z-20 mb-8">
          {/* Días de la semana */}
          <div>
            <h3 className="text-base font-bold text-gray-500 uppercase mb-6">Días de la semana</h3>
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, idx) => {
                const isSelected = day.date.toDateString() === selectedDate.toDateString();
                const hasData = hasDayData(day.date);

                return (
                  <button
                    key={idx}
                    onClick={() => handleDayClick(day.date)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'shadow-lg'
                        : hasData
                        ? 'bg-yellow-200'
                        : 'hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? themeColors.primary : undefined
                    }}
                  >
                    <span className="text-sm font-bold text-gray-600">{day.dayName}</span>
                    <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {day.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-2 gap-12">
            {/* Emociones del día */}
            <div>
              <h3 className="text-base font-bold text-gray-500 uppercase mb-6">Emociones del día</h3>

              {emotionesDelDia.length > 0 ? (
                <div className="space-y-6">
                  {emotionesDelDia.map((emocion, idx) => {
                    const emotionInfo = emotionColors[emocion.emocion] || { 
                      color: '#999', 
                      bg: '#F0F0F0' 
                    };
                    const porcentaje = Math.round((emocion.afectacion / 10) * 100);

                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-800">
                            {emocion.emocion}
                          </span>
                          <span className="text-sm font-bold" style={{ color: emotionInfo.color }}>
                            {porcentaje}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${porcentaje}%`,
                              backgroundColor: emotionInfo.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No hay emociones registradas para este día.
                </p>
              )}
            </div>

            {/* Citas pendientes */}
            <div>
              <h3 className="text-base font-bold text-gray-500 uppercase mb-6">Citas pendientes</h3>

              {citasDelDia.length > 0 ? (
                <div className="space-y-4">
                  {citasDelDia.map((cita, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border-2"
                      style={{
                        backgroundColor: `${themeColors.primaryLight}40`,
                        borderColor: themeColors.primary,
                      }}
                    >
                      <p className="font-semibold text-gray-800">
                        {cita.psicologoNombre}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No hay citas programadas para este día.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
