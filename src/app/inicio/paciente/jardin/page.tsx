"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
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

// Tipos para el mini-juego
interface PlantedFlower {
  id: string;
  x: number;
  y: number;
  type: 'happy' | 'calm' | 'energy' | 'love';
  stage: number; // 0: semilla, 1: brote, 2: flor completa
  plantedAt: number;
}

const flowerTypes = {
  happy: { color: '#FFD93D', emoji: '🌻', name: 'Alegría' },
  calm: { color: '#A5D7E8', emoji: '🌸', name: 'Calma' },
  energy: { color: '#FF6B9D', emoji: '🌺', name: 'Energía' },
  love: { color: '#C287E8', emoji: '💐', name: 'Amor' }
};

export default function JardinPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<{ [date: string]: EmotionRecord[] }>({});
  const [citasData, setCitasData] = useState<{ [date: string]: CitaData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del mini-juego
  const [plantedFlowers, setPlantedFlowers] = useState<PlantedFlower[]>([]);
  const [selectedFlowerType, setSelectedFlowerType] = useState<keyof typeof flowerTypes>('happy');
  const [showGamePanel, setShowGamePanel] = useState(false);
  const [wateringAnimation, setWateringAnimation] = useState<{x: number, y: number} | null>(null);
  const [showPlantAnimation, setShowPlantAnimation] = useState<{x: number, y: number} | null>(null);
  
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

  // Cargar flores guardadas (primero de DB, luego localStorage)
  useEffect(() => {
    const loadFlowers = async () => {
      try {
        // Intentar cargar desde la base de datos primero
        const response = await fetch('/api/paciente/jardin/cargar', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.flores && data.flores.length > 0) {
            console.log('[Jardín] Flores cargadas de DB:', data.flores.length);
            setPlantedFlowers(data.flores);
            // Actualizar localStorage también
            localStorage.setItem('jardin_flores', JSON.stringify(data.flores));
            return;
          }
        }
      } catch (error) {
        console.error('[Jardín] Error al cargar de DB:', error);
      }

      // Fallback: cargar desde localStorage
      const savedFlowers = localStorage.getItem('jardin_flores');
      if (savedFlowers) {
        try {
          const flowers = JSON.parse(savedFlowers);
          console.log('[Jardín] Flores cargadas del localStorage:', flowers.length);
          setPlantedFlowers(flowers);
        } catch (error) {
          console.error('[Jardín] Error al parsear flores:', error);
        }
      }
    };

    loadFlowers();
  }, []);

  // Guardar flores en localStorage Y base de datos cada vez que cambien
  useEffect(() => {
    const saveFlowers = async () => {
      if (plantedFlowers.length >= 0) {
        // Guardar en localStorage para uso inmediato
        localStorage.setItem('jardin_flores', JSON.stringify(plantedFlowers));
        console.log('[Jardín] Flores guardadas en localStorage:', plantedFlowers.length);
        
        // Guardar en base de datos para persistencia real
        try {
          await fetch('/api/paciente/jardin/guardar', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flores: plantedFlowers })
          });
          console.log('[Jardín] Flores guardadas en DB:', plantedFlowers.length);
        } catch (error) {
          console.error('[Jardín] Error al guardar en DB:', error);
        }
        
        // Disparar evento personalizado para actualizar dashboard
        window.dispatchEvent(new Event('jardinUpdated'));
      }
    };

    // Debounce para no hacer demasiadas peticiones
    const timeoutId = setTimeout(saveFlowers, 1000);
    return () => clearTimeout(timeoutId);
  }, [plantedFlowers]);

  // Lógica del mini-juego: crecer flores automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setPlantedFlowers(prev => 
        prev.map(flower => {
          const timePassed = Date.now() - flower.plantedAt;
          // Crece cada 4 segundos (más realista)
          if (timePassed > 4000 && flower.stage === 0) return { ...flower, stage: 1, plantedAt: Date.now() };
          if (timePassed > 4000 && flower.stage === 1) return { ...flower, stage: 2, plantedAt: Date.now() };
          return flower;
        })
      );
    }, 500); // Más frecuente para animaciones fluidas

    return () => clearInterval(interval);
  }, []);

  // Plantar una flor en el jardín
  const handlePlantFlower = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showGamePanel) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1600;
    const y = ((e.clientY - rect.top) / rect.height) * 550;

    // Verificar que está dentro del área del jardín (no en el espacio decorativo)
    if (y > 450 || x < 400 || x > 1200) return;

    // Mostrar animación de plantar
    setShowPlantAnimation({ x, y });
    setTimeout(() => setShowPlantAnimation(null), 800);

    // Sonido de plantar (opcional)
    const newFlower: PlantedFlower = {
      id: `flower-${Date.now()}-${Math.random()}`,
      x,
      y,
      type: selectedFlowerType,
      stage: 0,
      plantedAt: Date.now()
    };

    // Delay para sincronizar con animación
    setTimeout(() => {
      setPlantedFlowers(prev => [...prev, newFlower]);
    }, 300);
  };

  // Regar una flor para hacerla crecer más rápido
  const handleWaterFlower = (flowerId: string, x: number, y: number) => {
    setWateringAnimation({ x, y });
    setTimeout(() => setWateringAnimation(null), 1000);

    setPlantedFlowers(prev =>
      prev.map(flower => {
        if (flower.id === flowerId && flower.stage < 2) {
          return { ...flower, stage: flower.stage + 1, plantedAt: Date.now() };
        }
        return flower;
      })
    );
  };

  // Cosechar (remover) una flor con animación
  const handleHarvestFlower = (flowerId: string, x: number, y: number) => {
    // Mostrar partículas de cosecha
    setWateringAnimation({ x, y });
    setTimeout(() => setWateringAnimation(null), 600);
    
    // Remover la flor con un pequeño delay para la animación
    setTimeout(() => {
      setPlantedFlowers(prev => prev.filter(f => f.id !== flowerId));
    }, 200);
  };

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
        <div className="relative h-[70vh] min-h-[500px] pt-3 pb-4 overflow-hidden" style={{
          background: `linear-gradient(to bottom, ${themeColors.primaryLight}, ${themeColors.primaryDark}20)`
        }}>
          {/* SVG del jardín con grid y parcelas */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 375 450" 
            preserveAspectRatio="xMidYMin meet"
            onClick={handlePlantFlower}
            style={{ cursor: showGamePanel ? 'crosshair' : 'default', touchAction: 'none' }}
          >
            {/* Fondo base extendido */}
            <rect width="375" height="450" fill="#A6C48A"/>
            
            {/* Grid de cuadrícula */}
            <defs>
              <pattern id="gridMobile" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6E8759" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="375" height="380" fill="url(#gridMobile)"/>
            
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
            <circle cx="187" cy="140" r="22" fill="#CFAF92" opacity="0.9"/>
            <circle cx="187" cy="140" r="20" fill="none" stroke="#A89070" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Casita decorativa (esquina inferior izquierda) */}
            <rect x="15" y="330" width="50" height="40" fill="#B38A6D" rx="2"/>
            <polygon points="15,330 40,305 65,330" fill="#8B6F47"/>
            <rect x="32" y="348" width="12" height="14" fill="#654321"/>
            
            {/* Rocas decorativas (esquina derecha) */}
            <circle cx="320" cy="340" r="12" fill="#CFC9E4" opacity="0.7"/>
            <circle cx="345" cy="355" r="10" fill="#D3B4E4" opacity="0.8"/>
            <circle cx="360" cy="330" r="11" fill="#CFC9E4" opacity="0.6"/>
            
            {/* Vegetación decorativa */}
            <circle cx="10" cy="380" r="8" fill="#7DC383" opacity="0.5"/>
            <circle cx="30" cy="400" r="6" fill="#A6E4C4" opacity="0.6"/>
            <circle cx="350" cy="390" r="7" fill="#7DC383" opacity="0.5"/>

            {/* Flores plantadas - Mobile (escala ajustada) */}
            {plantedFlowers.map((flower, index) => {
              const flowerInfo = flowerTypes[flower.type];
              const timeSincePlanted = (Date.now() - flower.plantedAt) / 1000;
              
              // Ajustar coordenadas de desktop (1600x550) a mobile (375x450)
              const mobileX = (flower.x / 1600) * 375;
              const mobileY = (flower.y / 550) * 380;
              
              // Solo renderizar si está en área válida (más permisivo)
              if (mobileY > 370 || mobileX < 10 || mobileX > 365) return null;
              
              // Stage 0: Semilla (más grande en mobile)
              if (flower.stage === 0) {
                return (
                  <g key={flower.id} className="active:scale-125" onClick={(e) => { e.stopPropagation(); handleWaterFlower(flower.id, flower.x, flower.y); }}>
                    <ellipse cx={mobileX} cy={mobileY + 1} rx="6" ry="3" fill="#654321" opacity="0.6"/>
                    <circle cx={mobileX} cy={mobileY} r="5" fill="#8B4513" opacity="0.95" className="animate-pulse"/>
                    <circle cx={mobileX} cy={mobileY} r="12" fill="none" stroke="#4CAF50" strokeWidth="1.5" opacity="0.5" className="animate-ping"/>
                  </g>
                );
              }
              
              // Stage 1: Brote (más grande y detallado)
              if (flower.stage === 1) {
                return (
                  <g key={flower.id} className="active:scale-110" onClick={(e) => { e.stopPropagation(); handleWaterFlower(flower.id, flower.x, flower.y); }}>
                    <line x1={mobileX} y1={mobileY} x2={mobileX} y2={mobileY - 18} stroke="#388E3C" strokeWidth="3"/>
                    <ellipse cx={mobileX - 4} cy={mobileY - 9} rx="4" ry="3" fill="#66BB6A" opacity="0.95" className="animate-pulse" style={{ animationDuration: '2s' }}/>
                    <ellipse cx={mobileX + 4} cy={mobileY - 11} rx="4" ry="3" fill="#66BB6A" opacity="0.95" className="animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.3s' }}/>
                    <ellipse cx={mobileX} cy={mobileY - 18} rx="6" ry="9" fill={flowerInfo.color} opacity="0.9" className="animate-pulse"/>
                    <circle cx={mobileX} cy={mobileY - 18} r="14" fill="none" stroke={flowerInfo.color} strokeWidth="1.5" opacity="0.3" className="animate-ping"/>
                  </g>
                );
              }
              
              // Stage 2: Flor completa (más grande y hermosa)
              return (
                <g key={flower.id} className="active:scale-110" onClick={(e) => { e.stopPropagation(); handleHarvestFlower(flower.id, flower.x, flower.y); }}>
                  <line x1={mobileX} y1={mobileY} x2={mobileX} y2={mobileY - 28} stroke="#2E7D32" strokeWidth="3.5"/>
                  <ellipse cx={mobileX - 6} cy={mobileY - 14} rx="5" ry="4" fill="#4CAF50" opacity="0.95"/>
                  <ellipse cx={mobileX + 6} cy={mobileY - 16} rx="5" ry="4" fill="#4CAF50" opacity="0.95"/>
                  {/* Pétalos principales */}
                  <circle cx={mobileX - 8} cy={mobileY - 28} r="6" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={mobileX + 8} cy={mobileY - 28} r="6" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={mobileX} cy={mobileY - 36} r="6" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={mobileX} cy={mobileY - 20} r="6" fill={flowerInfo.color} opacity="0.95"/>
                  {/* Pétalos diagonales */}
                  <circle cx={mobileX - 6} cy={mobileY - 34} r="5" fill={flowerInfo.color} opacity="0.92"/>
                  <circle cx={mobileX + 6} cy={mobileY - 34} r="5" fill={flowerInfo.color} opacity="0.92"/>
                  {/* Centro */}
                  <circle cx={mobileX} cy={mobileY - 28} r="5" fill="#FFD700"/>
                  <circle cx={mobileX} cy={mobileY - 28} r="3.5" fill="#FFA000" opacity="0.8"/>
                  {/* Partículas */}
                  <circle className="animate-ping" cx={mobileX - 10} cy={mobileY - 32} r="2" fill={flowerInfo.color} opacity="0.8"/>
                  <circle className="animate-ping" cx={mobileX + 10} cy={mobileY - 32} r="2" fill={flowerInfo.color} opacity="0.8" style={{ animationDelay: '0.4s' }}/>
                  <circle className="animate-ping" cx={mobileX} cy={mobileY - 40} r="2" fill={flowerInfo.color} opacity="0.8" style={{ animationDelay: '0.8s' }}/>
                </g>
              );
            })}
          </svg>

          {/* Contenido flotante */}
          <div className="absolute inset-0 z-20 px-4 pt-3 flex justify-between items-start pointer-events-none">
            {/* Mini-juego toggle - Mobile */}
            <button 
              onClick={() => setShowGamePanel(!showGamePanel)}
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 pointer-events-auto ${
                showGamePanel 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white animate-pulse' 
                  : 'bg-white text-gray-700 hover:shadow-xl'
              }`}
            >
              {showGamePanel ? <span className="text-xl">✨</span> : <span className="text-xl">🌱</span>}
            </button>
            <button 
              onClick={() => router.push('/chat')}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:shadow-xl transition-all active:scale-95 pointer-events-auto"
            >
              <MessageCircle size={24} />
            </button>
          </div>

          {/* Panel de selección de emociones - Mobile */}
          {showGamePanel && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom duration-300 border-2 border-green-200 pointer-events-auto">
              <p className="text-xs font-bold text-gray-800 mb-2">🌻 Toca para plantar:</p>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {(Object.keys(flowerTypes) as Array<keyof typeof flowerTypes>).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedFlowerType(type)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      selectedFlowerType === type
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md scale-105'
                        : 'bg-gray-50 text-gray-700 active:scale-95'
                    }`}
                  >
                    <span className="text-xl">{flowerTypes[type].emoji}</span>
                    <span className="text-[9px]">{flowerTypes[type].name}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600">{plantedFlowers.filter(f => f.stage === 2).length}</div>
                  <div className="text-[9px] text-gray-600 font-semibold">Flores</div>
                </div>
                {plantedFlowers.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('¿Limpiar jardín?')) setPlantedFlowers([]);
                    }}
                    className="px-3 py-1 rounded-lg text-xs bg-red-50 text-red-600 font-semibold active:scale-95"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel blanco - Calendario y Emociones */}
        <div className="relative -mt-16 mx-4 bg-white rounded-3xl shadow-2xl p-6 space-y-6 z-20 mb-2">
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Botón Atrás */}
              <IconButton
                icon="back"
                onClick={() => router.back()}
                ariaLabel="Volver"
              />

              {/* Título */}
              <h1 className="text-2xl font-bold text-gray-800 flex-1">
                Mi Jardín Emocional
              </h1>

              {/* Navegación */}
              <div className="flex items-center gap-3">
                {/* Inicio */}
                <button
                  onClick={() => router.push('/inicio/paciente')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all flex items-center gap-2 active:scale-95"
                >
                  <Home size={20} />
                  <span className="hidden xl:inline">Inicio</span>
                </button>

                {/* Chat */}
                <button
                  onClick={() => router.push('/chat')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all flex items-center gap-2 active:scale-95"
                >
                  <MessageCircle size={20} />
                  <span className="hidden xl:inline">Chat</span>
                </button>
                
                {/* Perfil */}
                <button
                  onClick={() => router.push('/perfil/paciente')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all flex items-center gap-2 active:scale-95"
                >
                  <User size={20} />
                  <span className="hidden xl:inline">Perfil</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Sección superior - Jardín Digital */}
        <div className="relative h-[calc(100vh-80px)] pt-6 pb-8 overflow-hidden" style={{
          background: `linear-gradient(to bottom, ${themeColors.primaryLight}, ${themeColors.primaryDark}20)`
        }}>
          {/* Panel de control del mini-juego */}
          <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
            <button
              onClick={() => setShowGamePanel(!showGamePanel)}
              className={`px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                showGamePanel 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {showGamePanel ? '✨ Modo Jardín Activo' : '🌱 Activar Mini-Juego'}
            </button>

            {showGamePanel && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-left duration-500 border-2 border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-800">🌻 Selecciona tu emoción:</p>
                  <div className="px-2 py-1 bg-green-100 rounded-full text-xs font-semibold text-green-700">
                    {plantedFlowers.length} plantas
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(flowerTypes) as Array<keyof typeof flowerTypes>).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFlowerType(type)}
                      className={`px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center gap-1 ${
                        selectedFlowerType === type
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-105 ring-4 ring-green-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      <span className="text-2xl animate-bounce">{flowerTypes[type].emoji}</span>
                      <span className="text-xs">{flowerTypes[type].name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-green-100 space-y-2">
                  {/* Estadísticas del jardín */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-800">📊 Estado del Jardín</p>
                      <div className="px-2 py-0.5 bg-purple-100 rounded-full text-[10px] font-bold text-purple-700">
                        Total: {plantedFlowers.length}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div className="bg-white/70 rounded-lg p-2">
                        <div className="text-lg font-bold text-orange-600">
                          {plantedFlowers.filter(f => f.stage === 0).length}
                        </div>
                        <div className="text-[9px] text-gray-600 font-semibold">🌰 Semillas</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2">
                        <div className="text-lg font-bold text-green-600">
                          {plantedFlowers.filter(f => f.stage === 1).length}
                        </div>
                        <div className="text-[9px] text-gray-600 font-semibold">🌱 Brotes</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2">
                        <div className="text-lg font-bold text-pink-600">
                          {plantedFlowers.filter(f => f.stage === 2).length}
                        </div>
                        <div className="text-[9px] text-gray-600 font-semibold">🌸 Flores</div>
                      </div>
                    </div>
                    
                    {/* Barra de progreso total */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-600 font-semibold">Progreso del jardín</span>
                        <span className="text-[10px] text-purple-600 font-bold">
                          {Math.round((plantedFlowers.filter(f => f.stage === 2).length / Math.max(1, plantedFlowers.length)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-500"
                          style={{ 
                            width: `${(plantedFlowers.filter(f => f.stage === 2).length / Math.max(1, plantedFlowers.length)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">🎮 Cómo jugar:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Click en tierra = Plantar 🌱</li>
                      <li>• Click en planta = Regar 💧</li>
                      <li>• Click en flor = Cosechar ✂️</li>
                      <li className="text-green-600 font-semibold">• ¡Las flores crecen solas!</li>
                    </ul>
                  </div>
                  
                  {plantedFlowers.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('¿Seguro que quieres limpiar todo el jardín?')) {
                          setPlantedFlowers([]);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-50 to-orange-50 text-red-600 hover:from-red-100 hover:to-orange-100 transition-all active:scale-95 shadow-sm hover:shadow-md"
                    >
                      🗑️ Limpiar todo el jardín
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SVG del jardín con grid y parcelas */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1600 550" 
            preserveAspectRatio="xMidYMid slice"
            onClick={handlePlantFlower}
            style={{ cursor: showGamePanel ? 'crosshair' : 'default' }}
          >
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

            {/* Animación de plantar */}
            {showPlantAnimation && (
              <g className="animate-in fade-in zoom-in duration-300">
                {/* Ondas de impacto */}
                <circle 
                  cx={showPlantAnimation.x} 
                  cy={showPlantAnimation.y} 
                  r="25" 
                  fill="none" 
                  stroke="#4CAF50" 
                  strokeWidth="3" 
                  opacity="0.6"
                  className="animate-ping"
                />
                <circle 
                  cx={showPlantAnimation.x} 
                  cy={showPlantAnimation.y} 
                  r="15" 
                  fill="#4CAF50" 
                  opacity="0.2"
                  className="animate-pulse"
                />
                {/* Tierra levantándose */}
                {[0, 1, 2, 3].map((i) => (
                  <circle
                    key={i}
                    cx={showPlantAnimation.x + (Math.cos(i * Math.PI / 2) * 12)}
                    cy={showPlantAnimation.y + (Math.sin(i * Math.PI / 2) * 12)}
                    r="3"
                    fill="#8B4513"
                    opacity="0.5"
                    className="animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </g>
            )}

            {/* Animación de regar */}
            {wateringAnimation && (
              <g className="animate-in fade-in duration-300">
                {/* Regadera virtual */}
                <g opacity="0.9">
                  <ellipse
                    cx={wateringAnimation.x}
                    cy={wateringAnimation.y - 70}
                    rx="15"
                    ry="12"
                    fill="#81C784"
                    className="animate-bounce"
                  />
                  <rect
                    x={wateringAnimation.x + 10}
                    y={wateringAnimation.y - 75}
                    width="8"
                    height="4"
                    fill="#66BB6A"
                    rx="2"
                  />
                </g>

                {/* Gotas de agua cayendo con colores arcoíris */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const colors = ['#4FC3F7', '#81C784', '#FFD93D', '#FF6B9D'];
                  const color = colors[i % colors.length];
                  const offsetX = (Math.sin(i) * 20);
                  
                  return (
                    <g key={i}>
                      <ellipse
                        cx={wateringAnimation.x + offsetX}
                        cy={wateringAnimation.y - 65 + i * 8}
                        rx="3"
                        ry="5"
                        fill={color}
                        opacity="0.85"
                        className="animate-bounce"
                        style={{ animationDelay: `${i * 0.08}s`, animationDuration: '0.6s' }}
                      />
                      {/* Pequeño brillo */}
                      <circle
                        cx={wateringAnimation.x + offsetX - 1}
                        cy={wateringAnimation.y - 67 + i * 8}
                        r="1"
                        fill="white"
                        opacity="0.9"
                      />
                    </g>
                  );
                })}

                {/* Splash al caer con ondas */}
                <circle 
                  cx={wateringAnimation.x} 
                  cy={wateringAnimation.y} 
                  r="20" 
                  fill="#4FC3F7" 
                  opacity="0.3"
                  className="animate-ping"
                />
                <circle 
                  cx={wateringAnimation.x} 
                  cy={wateringAnimation.y} 
                  r="12" 
                  fill="#81C784" 
                  opacity="0.4"
                  className="animate-ping"
                  style={{ animationDelay: '0.2s' }}
                />
                
                {/* Partículas de brillo al regar */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle
                    key={`sparkle-${i}`}
                    cx={wateringAnimation.x + (Math.cos(i * 1.26) * 18)}
                    cy={wateringAnimation.y + (Math.sin(i * 1.26) * 18)}
                    r="2.5"
                    fill="#FFD700"
                    opacity="0.8"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </g>
            )}

            {/* Flores plantadas por el usuario (mini-juego) */}
            {plantedFlowers.map((flower, index) => {
              const flowerInfo = flowerTypes[flower.type];
              const timeSincePlanted = (Date.now() - flower.plantedAt) / 1000;
              const swayDelay = index * 0.2;
              
              // Stage 0: Semilla con tierra
              if (flower.stage === 0) {
                const growthProgress = Math.min(100, (timeSincePlanted / 4) * 100);
                
                return (
                  <g 
                    key={flower.id} 
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWaterFlower(flower.id, flower.x, flower.y);
                    }}
                  >
                    {/* Tierra removida */}
                    <ellipse 
                      cx={flower.x} 
                      cy={flower.y + 2} 
                      rx="8" 
                      ry="4" 
                      fill="#654321" 
                      opacity="0.6"
                    />
                    {/* Semilla */}
                    <circle 
                      cx={flower.x} 
                      cy={flower.y} 
                      r="5" 
                      fill="#8B4513" 
                      opacity="0.9"
                      className="animate-pulse"
                    />
                    {/* Brillo de vida */}
                    <circle 
                      cx={flower.x} 
                      cy={flower.y} 
                      r="12" 
                      fill="none" 
                      stroke="#4CAF50" 
                      strokeWidth="1.5" 
                      opacity="0.4"
                      className="animate-ping"
                    />
                    
                    {/* Barra de progreso */}
                    <g opacity="0.9">
                      <rect
                        x={flower.x - 15}
                        y={flower.y - 20}
                        width="30"
                        height="4"
                        fill="#E0E0E0"
                        rx="2"
                      />
                      <rect
                        x={flower.x - 15}
                        y={flower.y - 20}
                        width={30 * (growthProgress / 100)}
                        height="4"
                        fill="#4CAF50"
                        rx="2"
                      />
                    </g>
                    
                    {/* Tooltip al hover */}
                    <g className="opacity-0 hover:opacity-100 transition-opacity">
                      <rect
                        x={flower.x - 25}
                        y={flower.y - 35}
                        width="50"
                        height="18"
                        fill="white"
                        rx="4"
                        opacity="0.95"
                      />
                      <text
                        x={flower.x}
                        y={flower.y - 23}
                        fontSize="10"
                        fill="#4CAF50"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        💧 Regar
                      </text>
                    </g>
                  </g>
                );
              }
              
              // Stage 1: Brote creciendo con animación
              if (flower.stage === 1) {
                const growthProgress = Math.min(100, (timeSincePlanted / 4) * 100);
                
                return (
                  <g 
                    key={flower.id} 
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWaterFlower(flower.id, flower.x, flower.y);
                    }}
                    style={{
                      transformOrigin: `${flower.x}px ${flower.y}px`,
                      animationName: 'sway',
                      animationDuration: '2s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${swayDelay}s`
                    }}
                  >
                    {/* Tallo creciendo */}
                    <line 
                      x1={flower.x} 
                      y1={flower.y} 
                      x2={flower.x} 
                      y2={flower.y - 22} 
                      stroke="#388E3C" 
                      strokeWidth="3"
                    />
                    {/* Hoja izquierda */}
                    <ellipse 
                      cx={flower.x - 6} 
                      cy={flower.y - 12} 
                      rx="5" 
                      ry="3.5" 
                      fill="#66BB6A"
                      opacity="0.9"
                      className="animate-pulse"
                      style={{ animationDuration: '2s' }}
                    />
                    {/* Hoja derecha */}
                    <ellipse 
                      cx={flower.x + 6} 
                      cy={flower.y - 14} 
                      rx="5" 
                      ry="3.5" 
                      fill="#66BB6A"
                      opacity="0.9"
                      className="animate-pulse"
                      style={{ animationDuration: '2s', animationDelay: '0.3s' }}
                    />
                    {/* Capullo creciendo */}
                    <ellipse 
                      cx={flower.x} 
                      cy={flower.y - 22} 
                      rx="7" 
                      ry="10" 
                      fill={flowerInfo.color} 
                      opacity="0.85"
                      className="animate-pulse"
                    />
                    {/* Energía de crecimiento */}
                    <circle 
                      cx={flower.x} 
                      cy={flower.y - 22} 
                      r="18" 
                      fill="none" 
                      stroke={flowerInfo.color} 
                      strokeWidth="1.5" 
                      opacity="0.25"
                      className="animate-ping"
                    />
                    
                    {/* Barra de progreso */}
                    <g opacity="0.9">
                      <rect
                        x={flower.x - 18}
                        y={flower.y - 35}
                        width="36"
                        height="5"
                        fill="#E0E0E0"
                        rx="2.5"
                      />
                      <rect
                        x={flower.x - 18}
                        y={flower.y - 35}
                        width={36 * (growthProgress / 100)}
                        height="5"
                        fill={flowerInfo.color}
                        rx="2.5"
                        className="transition-all duration-500"
                      />
                    </g>
                    
                    {/* Tooltip al hover */}
                    <g className="opacity-0 hover:opacity-100 transition-opacity">
                      <rect
                        x={flower.x - 30}
                        y={flower.y - 48}
                        width="60"
                        height="20"
                        fill="white"
                        rx="4"
                        opacity="0.95"
                      />
                      <text
                        x={flower.x}
                        y={flower.y - 34}
                        fontSize="11"
                        fill={flowerInfo.color}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        💧 Regar +rápido
                      </text>
                    </g>
                  </g>
                );
              }
              
              // Stage 2: Flor completa hermosa y animada
              return (
                <g 
                  key={flower.id} 
                  className="cursor-pointer hover:scale-115 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHarvestFlower(flower.id, flower.x, flower.y);
                  }}
                  style={{
                    transformOrigin: `${flower.x}px ${flower.y}px`,
                    animationName: 'sway',
                    animationDuration: '4s',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${swayDelay}s`
                  }}
                >
                  {/* Tallo robusto */}
                  <line 
                    x1={flower.x} 
                    y1={flower.y} 
                    x2={flower.x} 
                    y2={flower.y - 40} 
                    stroke="#2E7D32" 
                    strokeWidth="4"
                  />
                  {/* Hojas inferiores */}
                  <ellipse 
                    cx={flower.x - 9} 
                    cy={flower.y - 20} 
                    rx="8" 
                    ry="6" 
                    fill="#4CAF50" 
                    opacity="0.95"
                  />
                  <ellipse 
                    cx={flower.x + 9} 
                    cy={flower.y - 24} 
                    rx="8" 
                    ry="6" 
                    fill="#4CAF50" 
                    opacity="0.95"
                  />
                  
                  {/* Pétalos principales (4 direcciones) */}
                  <circle cx={flower.x - 11} cy={flower.y - 40} r="8" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={flower.x + 11} cy={flower.y - 40} r="8" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={flower.x} cy={flower.y - 51} r="8" fill={flowerInfo.color} opacity="0.95"/>
                  <circle cx={flower.x} cy={flower.y - 29} r="8" fill={flowerInfo.color} opacity="0.95"/>
                  
                  {/* Pétalos diagonales */}
                  <circle cx={flower.x - 8} cy={flower.y - 48} r="7" fill={flowerInfo.color} opacity="0.92"/>
                  <circle cx={flower.x + 8} cy={flower.y - 48} r="7" fill={flowerInfo.color} opacity="0.92"/>
                  <circle cx={flower.x - 8} cy={flower.y - 32} r="7" fill={flowerInfo.color} opacity="0.92"/>
                  <circle cx={flower.x + 8} cy={flower.y - 32} r="7" fill={flowerInfo.color} opacity="0.92"/>
                  
                  {/* Centro dorado brillante con textura */}
                  <circle cx={flower.x} cy={flower.y - 40} r="7" fill="#FFD700"/>
                  <circle cx={flower.x} cy={flower.y - 40} r="5" fill="#FFA000" opacity="0.8"/>
                  <circle cx={flower.x - 1} cy={flower.y - 41} r="2" fill="#FFF" opacity="0.6"/>
                  
                  {/* Partículas mágicas flotantes */}
                  <circle className="animate-ping" cx={flower.x - 15} cy={flower.y - 45} r="2.5" fill={flowerInfo.color} opacity="0.8"/>
                  <circle className="animate-ping" cx={flower.x + 15} cy={flower.y - 45} r="2.5" fill={flowerInfo.color} opacity="0.8" style={{ animationDelay: '0.4s' }}/>
                  <circle className="animate-ping" cx={flower.x} cy={flower.y - 55} r="2.5" fill={flowerInfo.color} opacity="0.8" style={{ animationDelay: '0.8s' }}/>
                  <circle className="animate-ping" cx={flower.x - 8} cy={flower.y - 52} r="1.5" fill="#FFD700" opacity="0.9" style={{ animationDelay: '0.2s' }}/>
                  <circle className="animate-ping" cx={flower.x + 8} cy={flower.y - 52} r="1.5" fill="#FFD700" opacity="0.9" style={{ animationDelay: '0.6s' }}/>
                  
                  {/* Aura de luz alrededor */}
                  <circle 
                    cx={flower.x} 
                    cy={flower.y - 40} 
                    r="25" 
                    fill="none" 
                    stroke={flowerInfo.color} 
                    strokeWidth="2" 
                    opacity="0.2"
                    className="animate-pulse"
                  />
                  
                  {/* Indicador de "Click para cosechar" al hacer hover */}
                  <g className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <circle 
                      cx={flower.x} 
                      cy={flower.y - 65} 
                      r="12" 
                      fill="white" 
                      opacity="0.95"
                    />
                    <text 
                      x={flower.x} 
                      y={flower.y - 62} 
                      fontSize="12" 
                      fill="#2E7D32" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      ✂️
                    </text>
                  </g>
                </g>
              );
            })}
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
