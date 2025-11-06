'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Button from '@/components/ui/Button';

interface PacienteDisponible {
  id: string;
  nombreCompleto: string;
  email: string;
}

export default function AsignarPacientePage() {
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
      const response = await fetch('/api/psicologo/pacientes-disponibles');
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
        body: JSON.stringify({ pacienteId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al asignar');

      setAssignMessage(`✓ ${pacienteName} asignado exitosamente`);
      // Remover de la lista
      setPacientesDisponibles(prev => prev.filter(p => p.id !== pacienteId));
      setFilteredPacientes(prev => prev.filter(p => p.id !== pacienteId));
    } catch (err) {
      setAssignMessage(`✗ Error: ${err instanceof Error ? err.message : 'Intenta de nuevo'}`);
    } finally {
      setAssigning(null);
    }
  };

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingIndicator text="Cargando pacientes disponibles..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/inicio/psicologo/pacientes"
            className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Asignar Paciente Existente</h1>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--color-theme-primary)] focus:outline-none bg-white shadow-sm transition-colors text-gray-900"
            />
          </div>
        </div>

        {/* Contenido */}
        {dataError ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{dataError}</p>
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes disponibles'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Todos los pacientes sin asignar están aquí. Crea uno nuevo si lo necesitas.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPacientes.map((paciente) => (
              <div
                key={paciente.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{paciente.nombreCompleto}</h3>
                  <p className="text-sm text-gray-500">{paciente.email}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssign(paciente.id, paciente.nombreCompleto)}
                  isLoading={assigning === paciente.id}
                  loadingText="Asignando..."
                  className="ml-4 flex-shrink-0"
                >
                  Asignar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje de estado */}
        {assignMessage && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
            assignMessage.startsWith('✓') ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {assignMessage}
          </div>
        )}
      </div>
    </div>
  );
}
