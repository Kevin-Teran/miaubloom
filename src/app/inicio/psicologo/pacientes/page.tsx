'use client';

export const dynamic = 'force-dynamic';

/**
 * @file page.tsx
 * @route src/app/inicio/psicologo/pacientes/page.tsx
 * @description Página de lista completa de pacientes con búsqueda
 * @author Kevin Mariano
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Button from '@/components/ui/Button';
import { PatientCard } from '@/components/psicologo/PatientCard';

interface Paciente {
  id: string;
  nombre: string;
  avatar: string;
  status: string;
}

export default function PacientesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch de pacientes
  useEffect(() => {
    if (!user) return;

    const fetchPacientes = async () => {
      try {
        setIsDataLoading(true);
        setDataError(null);

        const response = await fetch('/api/psicologo/pacientes');

        if (response.status === 401) {
          setDataError('No autorizado. Por favor inicia sesión.');
          return;
        }

        if (!response.ok) {
          setDataError('Error al cargar los pacientes');
          return;
        }

        const data = await response.json();
        setPacientes(data.pacientes || []);
        setFilteredPacientes(data.pacientes || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setDataError('Error de conexión. Intenta de nuevo.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchPacientes();
  }, [user]);

  // Filtrar pacientes por búsqueda
  useEffect(() => {
    const filtered = pacientes.filter((paciente) =>
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPacientes(filtered);
  }, [searchTerm, pacientes]);

  if (isLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white">
        <LoadingIndicator
          text="Cargando pacientes..."
          className="[&>p]:text-gray-600 [&>div]:opacity-50"
          trackColor="var(--color-theme-primary-light)"
          barColor="var(--color-theme-primary)"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header MODIFICADO */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/inicio/psicologo"
              className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Mis Pacientes</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
              {filteredPacientes.length} paciente{filteredPacientes.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/inicio/psicologo/pacientes/asignar')}
              >
                Asignar Existente
              </Button>
              <Button 
                size="sm" 
                onClick={() => router.push('/inicio/psicologo/pacientes/crear')}
              >
                + Crear Nuevo
              </Button>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mb-8">
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
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--color-theme-primary)] focus:outline-none bg-white shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Contenido */}
        {dataError ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{dataError}</p>
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No se encontraron pacientes' : 'No tienes pacientes'}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Intenta con otro término de búsqueda'
                : 'Tus pacientes aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPacientes.map((paciente, index) => (
              <PatientCard
                key={paciente.id || index}
                paciente={paciente}
                href={`/inicio/psicologo/paciente/${paciente.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
