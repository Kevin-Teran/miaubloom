'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';

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

  const [pacienteId, setPacienteId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [duracionMin, setDuracionMin] = useState(50);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchPacientes = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/psicologo/pacientes', { credentials: 'include' });
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
        body: JSON.stringify({ pacienteId, fecha, horaInicio, duracionMin: Number(duracionMin) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al crear la cita');
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
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10" style={{ borderBottom: '1px solid var(--color-theme-primary-light)' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <IconButton icon="back" onClick={() => router.back()} bgColor="var(--color-theme-primary)" ariaLabel="Volver" />
          <div>
            <h1 className="text-xl font-bold text-[#070806]">Agendar Nueva Cita</h1>
            <p className="text-sm text-[#B6BABE]">Programa una sesión con tu paciente</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm space-y-6" style={{ border: '1px solid var(--color-theme-primary-light)' }}>
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Asignar a Paciente</label>
            <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} required className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 text-[#070806] font-medium appearance-none cursor-pointer transition-colors" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }}>
              <option value="">Selecciona un paciente...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <p className="text-xs text-[#B6BABE] mt-1.5">Elige el paciente para esta sesión</p>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Fecha de la Cita</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-colors" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Hora de Inicio</label>
            <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-colors" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Duración (en minutos)</label>
            <input type="number" value={String(duracionMin)} onChange={(e) => setDuracionMin(Number(e.target.value))} min="15" step="5" placeholder="Ej: 50" required className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-colors" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
            <p className="text-xs text-[#B6BABE] mt-1.5">Duración típica: 45-60 minutos</p>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} fullWidth className="border-2 font-semibold rounded-2xl py-4" style={{ borderColor: 'var(--color-theme-primary)', color: 'var(--color-theme-primary)' }}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} loadingText="Agendando..." fullWidth className="text-white font-semibold rounded-2xl py-4 shadow-sm" style={{ backgroundColor: 'var(--color-theme-primary)' }}>
              Agendar Cita
            </Button>
          </div>
        </form>

        <div className="mt-6 p-5 bg-white/60 rounded-2xl" style={{ border: '1px solid var(--color-theme-primary-light)' }}>
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
