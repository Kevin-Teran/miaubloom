'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';

const initialState = {
  nombreCompleto: '',
  email: '',
  password: '',
  day: '',
  month: '',
  year: '',
  genero: '',
};

export default function CrearPacientePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/psicologo/crear-paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear');
      }

      router.push('/inicio/psicologo/pacientes?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Un error ocurrió');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingIndicator text="Cargando..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10" style={{ borderBottom: '1px solid var(--color-theme-primary-light)' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <IconButton icon="back" onClick={() => router.back()} bgColor="var(--color-theme-primary)" ariaLabel="Volver" />
          <div>
            <h1 className="text-xl font-bold text-[#070806]">Crear Nueva Cuenta</h1>
            <p className="text-sm text-[#B6BABE]">Registra un nuevo paciente</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm space-y-6" style={{ border: '1px solid var(--color-theme-primary-light)' }}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Nombre Completo</label>
            <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required placeholder="Ej: María García" className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Contraseña Temporal</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Mínimo 6 caracteres" className="w-full px-5 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }} />
            <p className="text-xs text-[#B6BABE] mt-1.5">El paciente podrá cambiarla después</p>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-[#070806]">Fecha de Nacimiento</label>
            <div className="grid grid-cols-3 gap-3">
              <select name="day" value={formData.day} onChange={handleChange} required className="w-full px-4 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all appearance-none text-center cursor-pointer" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='var(--color-theme-primary)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}>
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              
              <select name="month" value={formData.month} onChange={handleChange} required className="w-full px-4 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all appearance-none text-center cursor-pointer" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='var(--color-theme-primary)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}>
                <option value="">Mes</option>
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => (<option key={m} value={String(i + 1)}>{m}</option>))}
              </select>
              
              <select name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-4 border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-2 text-[#070806] font-medium transition-all appearance-none text-center cursor-pointer" style={{ backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='var(--color-theme-primary)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}>
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-base font-semibold text-[#070806]">Género</label>
            <div className="flex flex-wrap gap-3">
              {['Masculino', 'Femenino', 'Otro'].map((gen) => (
                <label key={gen} className={`flex-1 min-w-[120px] flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.genero === gen ? 'text-white' : 'text-[#070806]'}`} style={formData.genero === gen ? { backgroundColor: 'var(--color-theme-primary)', borderColor: 'var(--color-theme-primary)' } : { backgroundColor: 'var(--color-theme-primary-light)', borderColor: 'var(--color-theme-primary-light)' }}>
                  <input type="radio" name="genero" value={gen} checked={formData.genero === gen} onChange={handleChange} required className="sr-only" />
                  <span className="font-medium">{gen}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} fullWidth disabled={isLoading} className="font-semibold rounded-2xl py-4" style={{ borderColor: 'var(--color-theme-primary)', color: 'var(--color-theme-primary)' }}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading} loadingText="Creando..." fullWidth className="text-white font-semibold rounded-2xl py-4 shadow-sm" style={{ backgroundColor: 'var(--color-theme-primary)' }}>
              Crear y Asignar
            </Button>
          </div>
        </form>

        <div className="mt-6 p-5 bg-white/60 rounded-2xl" style={{ border: '1px solid var(--color-theme-primary-light)' }}>
          <h3 className="font-semibold text-[#070806] mb-2 flex items-center gap-2">
            <span className="text-lg">ℹ️</span>
            Información importante
          </h3>
          <ul className="space-y-1.5 text-sm text-[#B6BABE]">
            <li>• El paciente recibirá las credenciales para acceder</li>
            <li>• La contraseña temporal debe ser cambiada en el primer acceso</li>
            <li>• Todos los campos son obligatorios para el registro</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
