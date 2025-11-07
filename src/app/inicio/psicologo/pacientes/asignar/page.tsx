'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';

interface PacienteDisponible {
  id: string;
  nombreCompleto: string;
  email: string;
}

export default function AsignarPacientePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [pacientesDisponibles, setPacientesDisponibles] = useState<PacienteDisponible[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<PacienteDisponible[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignMessage, setAssignMessage] = useState<string | null>(null);

  // Fetch pacientes disponibles (sin psicólogo)
  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchPacientesDisponibles();
    }
  }, [user, isAuthLoading]);

  const fetchPacientesDisponibles = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const response = await fetch('/api/psicologo/pacientes-disponibles', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al cargar pacientes disponibles');
      const data = await response.json();
      setPacientesDisponibles(data.pacientes || []);
      setFilteredPacientes(data.pacientes || []);
    } catch (error) {
      console.error('Error:', error);
      setDataError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Filtrar por búsqueda
  useEffect(() => {
    const filtered = pacientesDisponibles.filter((p) =>
      p.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPacientes(filtered);
  }, [searchTerm, pacientesDisponibles]);

  const handleAssign = async (pacienteId: string, pacienteName: string) => {
    setAssigning(pacienteId);
    setAssignMessage(null);

    try {
      const response = await fetch('/api/psicologo/asignar-paciente-por-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pacienteId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al asignar');

      setAssignMessage(`✓ ${pacienteName} asignado exitosamente`);
      // Remover de la lista
      setPacientesDisponibles((prev) => prev.filter((p) => p.id !== pacienteId));
      setFilteredPacientes((prev) => prev.filter((p) => p.id !== pacienteId));
    } catch (err) {
      setAssignMessage(`✗ Error: ${err instanceof Error ? err.message : 'Intenta de nuevo'}`);
    } finally {
      setAssigning(null);
    }
  };

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingIndicator text="Cargando pacientes disponibles..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10 border-b border-[#F2C2C1]/20">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <IconButton
            icon="back"
            onClick={() => router.back()}
            bgColor="#F2C2C1"
            ariaLabel="Volver"
          />
          <div>
            <h1 className="text-xl font-bold text-[#070806]">Asignar Paciente Existente</h1>
            <p className="text-sm text-[#B6BABE]">Selecciona un paciente para asignar</p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto p-6">
        {/* Búsqueda */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B6BABE]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-3xl border-2 border-[#F2C2C1]/30 focus:border-[#F2C2C1] focus:outline-none focus:ring-2 focus:ring-[#F2C2C1]/20 bg-white shadow-sm transition-all text-[#070806] font-medium"
            />
          </div>
        </div>

        {/* Contenido */}
        {dataError ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center border border-red-200">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#070806] mb-2">Error</h2>
            <p className="text-[#B6BABE]">{dataError}</p>
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-[#F2C2C1]/20">
            <div className="w-20 h-20 mx-auto bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#F2C2C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#070806] mb-2">
              {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes disponibles'}
            </h3>
            <p className="text-[#B6BABE] mb-6">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Todos los pacientes sin asignar aparecerán aquí'}
            </p>
            {!searchTerm && (
              <Button
                size="sm"
                onClick={() => router.push('/inicio/psicologo/pacientes/crear')}
                className="bg-[#F2C2C1] hover:bg-[#F2C2C1]/90 text-white font-semibold rounded-2xl"
              >
                + Crear Nuevo Paciente
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPacientes.map((paciente) => (
              <div
                key={paciente.id}
                className="bg-white rounded-3xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all border border-[#F2C2C1]/20"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F2C2C1] to-[#F2C2C1]/70 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {paciente.nombreCompleto.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#070806] truncate">{paciente.nombreCompleto}</h3>
                    <p className="text-sm text-[#B6BABE] truncate">{paciente.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssign(paciente.id, paciente.nombreCompleto)}
                  isLoading={assigning === paciente.id}
                  loadingText="Asignando..."
                  className="ml-4 flex-shrink-0 bg-[#F2C2C1] hover:bg-[#F2C2C1]/90 text-white font-semibold rounded-2xl"
                >
                  Asignar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje de estado */}
        {assignMessage && (
          <div
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-lg text-white font-medium ${
              assignMessage.startsWith('✓') ? 'bg-green-500' : 'bg-red-500'
            } animate-in slide-in-from-bottom-5 duration-300`}
          >
            {assignMessage}
          </div>
        )}

        {/* Info adicional */}
        <div className="mt-8 p-5 bg-white/60 rounded-2xl border border-[#F2C2C1]/20">
          <h3 className="font-semibold text-[#070806] mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            ¿Qué significa asignar un paciente?
          </h3>
          <ul className="space-y-1.5 text-sm text-[#B6BABE]">
            <li>• El paciente quedará vinculado a tu cuenta</li>
            <li>• Podrás ver su progreso y datos emocionales</li>
            <li>• Solo pacientes sin psicólogo asignado aparecen aquí</li>
          </ul>
        </div>
      </main>
    </div>
  );
}