'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';

// Interfaz para Paciente
interface Paciente {
  id: string;
  nombre: string;
}

export default function NuevaCitaPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [pacienteId, setPacienteId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [duracionMin, setDuracionMin] = useState(50);

  // Cargar la lista de pacientes
  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchPacientes = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/psicologo/pacientes', {
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Error al cargar pacientes');
          const data = await res.json();
          setPacientes(data.pacientes || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Un error ocurrió');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPacientes();
    }
  }, [user, isAuthLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/psicologo/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pacienteId,
          fecha,
          horaInicio,
          duracionMin: Number(duracionMin),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la cita');
      }

      // Éxito: Redirigir a la lista con parámetro de éxito
      router.push('/inicio/psicologo/citas?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Un error ocurrió');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingIndicator text="Cargando formulario..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Encabezado */}
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10 border-b border-[#F2C2C1]/20">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <IconButton
            icon="back"
            onClick={() => router.back()}
            bgColor="#F2C2C1"
            ariaLabel="Volver"
          />
          <div>
            <h1 className="text-xl font-bold text-[#070806]">Agendar Nueva Cita</h1>
            <p className="text-sm text-[#B6BABE]">Programa una sesión con tu paciente</p>
          </div>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-[#F2C2C1]/20 space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Selector de Paciente */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">
              Asignar a Paciente
            </label>
            <div className="relative">
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                required
                className="w-full px-5 py-4 bg-[#FFF5F5] border-2 border-[#F2C2C1]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-[#F2C2C1] focus:ring-[#F2C2C1]/20 text-[#070806] font-medium transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23F2C2C1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '3rem'
                }}
              >
                <option value="">Selecciona un paciente...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-[#B6BABE] mt-1.5">Elige el paciente para esta sesión</p>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">
              Fecha de la Cita
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full px-5 py-4 bg-[#FFF5F5] border-2 border-[#F2C2C1]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-[#F2C2C1] focus:ring-[#F2C2C1]/20 text-[#070806] font-medium transition-all"
            />
          </div>

          {/* Hora */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">
              Hora de Inicio
            </label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
              className="w-full px-5 py-4 bg-[#FFF5F5] border-2 border-[#F2C2C1]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-[#F2C2C1] focus:ring-[#F2C2C1]/20 text-[#070806] font-medium transition-all"
            />
          </div>

          {/* Duración */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">
              Duración (en minutos)
            </label>
            <input
              type="number"
              value={String(duracionMin)}
              onChange={(e) => setDuracionMin(Number(e.target.value))}
              min="15"
              step="5"
              placeholder="Ej: 50"
              required
              className="w-full px-5 py-4 bg-[#FFF5F5] border-2 border-[#F2C2C1]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-[#F2C2C1] focus:ring-[#F2C2C1]/20 text-[#070806] font-medium transition-all"
            />
            <p className="text-xs text-[#B6BABE] mt-1.5">Duración típica: 45-60 minutos</p>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              fullWidth
              className="border-2 border-[#F2C2C1] text-[#F2C2C1] hover:bg-[#FFF5F5] font-semibold rounded-2xl py-4"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              loadingText="Agendando..." 
              fullWidth
              className="bg-[#F2C2C1] hover:bg-[#F2C2C1]/90 text-white font-semibold rounded-2xl py-4 shadow-sm"
            >
              Agendar Cita
            </Button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-6 p-5 bg-white/60 rounded-2xl border border-[#F2C2C1]/20">
          <h3 className="font-semibold text-[#070806] mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Tips para una mejor sesión
          </h3>
          <ul className="space-y-1.5 text-sm text-[#B6BABE]">
            <li>• Confirma la disponibilidad del paciente antes de agendar</li>
            <li>• Considera tiempo de descanso entre sesiones</li>
            <li>• Prepara el material necesario con anticipación</li>
          </ul>
        </div>
      </main>
    </div>
  );
}