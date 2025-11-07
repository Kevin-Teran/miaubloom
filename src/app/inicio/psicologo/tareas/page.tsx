"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';
import { SuccessToast } from '@/components/ui/SuccessToast';

// Interfaz para Paciente
interface Paciente {
  id: string;
  nombre: string;
}

export default function AsignarTareasPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado del formulario
  const [pacienteId, setPacienteId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  // Cargar la lista de pacientes para el dropdown
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
      const response = await fetch('/api/psicologo/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pacienteId,
          titulo,
          descripcion,
          fechaLimite,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al asignar la tarea');
      }
      
      // Éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Limpiar formulario
      setPacienteId('');
      setTitulo('');
      setDescripcion('');
      setFechaLimite('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Un error ocurrió');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingIndicator text="Cargando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <IconButton
            icon="back"
            onClick={() => router.back()}
            bgColor="var(--color-theme-primary)"
            ariaLabel="Volver"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Asignar Nueva Tarea
          </h1>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asignar a Paciente
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:border-pink-400 focus:ring-pink-400 text-gray-900 bg-white"
            >
              <option value="" disabled className="text-gray-500">Selecciona un paciente...</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id} className="text-gray-900">{p.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título de la Tarea <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Ejercicio de respiración"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:border-pink-400 focus:ring-pink-400 text-gray-900 bg-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción <span className="text-pink-500">*</span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles de la actividad..."
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:border-pink-400 focus:ring-pink-400 text-gray-900 bg-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Límite <span className="text-pink-500">*</span>
            </label>
            <input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:border-pink-400 focus:ring-pink-400 text-gray-900 bg-white"
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              loadingText="Asignando..." 
              fullWidth
            >
              Asignar Tarea
            </Button>
          </div>
        </form>
      </main>

      <SuccessToast message="¡Tarea asignada con éxito!" isOpen={showSuccess} />
    </div>
  );
}
