/**
 * @file CalendarWithCitas.tsx
 * @description Componente de calendario con citas para pacientes
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, User } from 'lucide-react';
import { modalFadeIn, modalFadeOut } from '@/lib/animations';

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

interface CalendarWithCitasProps {
  themeColor?: string;
  themeColorLight?: string;
  themeColorDark?: string;
}

export function CalendarWithCitas({
  themeColorLight = 'var(--color-theme-primary-light)',
  themeColorDark = 'var(--color-theme-primary-dark)',
}: CalendarWithCitasProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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
      }
    };

    if (showCalendar) {
      fetchCitas();
    }
  }, [showCalendar]);

  // Animación de entrada del modal
  useEffect(() => {
    if (showCalendar && modalRef.current && backdropRef.current) {
      modalFadeIn(modalRef.current, backdropRef.current);
    }
  }, [showCalendar]);

  // Cerrar calendario cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        handleCloseCalendar();
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCalendar]);

  const handleCloseCalendar = () => {
    if (modalRef.current && backdropRef.current) {
      modalFadeOut(modalRef.current, backdropRef.current, () => setShowCalendar(false));
    } else {
      setShowCalendar(false);
    }
  };

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
  const formattedDate = selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Crear grid de días
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (const day of daysArray) {
    calendarDays.push(day);
  }

  return (
    <div ref={calendarRef} className="relative">
      {/* Botón para abrir calendario */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 hover:shadow-xl transition-all duration-200 active:scale-95"
      >
        <svg
          className="w-5 h-5 text-[var(--color-theme-primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <div className="text-center">
          <span className="block text-2xl font-bold text-[var(--color-theme-primary)] leading-none">
            {new Date().getDate()}
          </span>
          <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
            {new Date().toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase()}
          </span>
        </div>
      </button>

      {/* Backdrop */}
      {showCalendar && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={handleCloseCalendar}
        />
      )}

      {/* Calendario emergente - Centrado en pantalla */}
      {showCalendar && (
        <div
          ref={modalRef}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-6 w-[90vw] max-w-md"
        >
          {/* Header del modal */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-800">Mis Citas</h3>
            <button
              onClick={handleCloseCalendar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 active:scale-95"
            >
              <X size={22} className="text-gray-400" />
            </button>
          </div>

          {/* Calendario Grid */}
          <div className="mb-6">
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

          {/* Divisor */}
          <div className="h-px bg-gray-200 my-6" />

          {/* Citas del día seleccionado */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            {citasDelDia.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
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
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: themeColorLight }}
                        >
                          <User size={20} style={{ color: themeColorDark }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {psicologoName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <Clock size={14} />
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

