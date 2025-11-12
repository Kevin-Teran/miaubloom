"use client";

/**
 * @file page.tsx
 * @route src/app/inicio/paciente/calendario/page.tsx
 * @description Página de Calendario con Citas para Paciente
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { pageTransition } from '@/lib/animations';

interface Cita {
  id: string;
  psicologoNombre?: string;
  psicologo?: {
    nombreCompleto: string;
    id?: string;
  };
  fecha?: string;
  fechaHoraInicio?: string;
  hora?: string;
  estado?: string;
  psicologoId?: string;
}

export default function CalendarioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [loadingCitas, setLoadingCitas] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  // Animación de entrada
  useEffect(() => {
    if (!isLoading && pageRef.current) {
      pageTransition(pageRef.current, 0.1);
    }
  }, [isLoading]);

  // Cargar citas del paciente
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await fetch('/api/paciente/calendario', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.citas) {
            setCitas(data.citas);
          }
        }
      } catch (error) {
        console.error('Error fetching citas:', error);
      } finally {
        setLoadingCitas(false);
      }
    };

    if (user) {
      fetchCitas();
    }
  }, [user]);

  // Obtener citas para una fecha específica
  const getCitasForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return citas.filter(cita => {
      const citaDate = cita.fecha || cita.fechaHoraInicio?.split('T')[0];
      return citaDate === dateStr;
    });
  };

  // Obtener citas del día seleccionado
  const citasDelDia = getCitasForDate(selectedDate);

  // Generar días del calendario
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Crear grid de días
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (const day of daysArray) {
    calendarDays.push(day);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white">
        <LoadingIndicator text="Cargando calendario..." />
      </div>
    );
  }

  const themeColorLight = 'var(--color-theme-primary-light)';
  const themeColorDark = 'var(--color-theme-primary)';

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] to-white pb-8"
    >
      {/* Header */}
      <header className="bg-[var(--color-theme-primary)] pt-safe px-4 py-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white flex-1">Mis Citas</h1>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Calendario */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          {/* Header del mes */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:scale-95"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h4 className="font-semibold text-gray-800 capitalize text-center flex-1">
              {monthName}
            </h4>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:scale-95"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDayClick(day)}
                disabled={!day}
                className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center relative active:scale-95 ${
                  !day
                    ? 'cursor-default'
                    : isSelected(day)
                    ? 'text-white'
                    : isToday(day)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={
                  day && isSelected(day)
                    ? {
                        backgroundColor: themeColorDark,
                        boxShadow: `0 0 0 1px ${themeColorDark}`
                      }
                    : {}
                }
              >
                {day}
                {day && getCitasForDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)).length > 0 && (
                  <div
                    className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isSelected(day) ? 'white' : themeColorDark
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Citas del día seleccionado */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-4 capitalize">
            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {loadingCitas ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: themeColorDark }} />
              <p className="text-gray-500 mt-4">Cargando citas...</p>
            </div>
          ) : citasDelDia.length > 0 ? (
            <div className="space-y-3">
              {citasDelDia.map((cita) => {
                const psicologoName = cita.psicologoNombre || cita.psicologo?.nombreCompleto || 'Psicólogo';
                const citaDateTime = cita.fechaHoraInicio ? new Date(cita.fechaHoraInicio) : null;
                const hora = cita.hora || (citaDateTime ? citaDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '');

                return (
                  <div
                    key={cita.id}
                    className="p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg"
                    style={{
                      borderColor: themeColorDark + '30',
                      backgroundColor: themeColorLight + '30'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: themeColorLight }}
                      >
                        <User size={24} style={{ color: themeColorDark }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-base truncate">
                          {psicologoName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">
                          <Clock size={16} />
                          {hora}
                        </p>
                      </div>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: themeColorDark + '15',
                          color: themeColorDark
                        }}
                      >
                        {cita.estado || 'Programada'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: themeColorLight + '40' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: themeColorDark + '40' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">Sin citas programadas</p>
              <p className="text-xs text-gray-400 mt-1">No tienes citas para este día</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

