"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

// Tipos para estadísticas de emociones
interface EstadisticaEmocional {
  nombre: string;
  cantidad: number;
  promedioNivelAfectacion: number;
  color: string;
}

interface PacienteData {
  id: string;
  nombreCompleto: string;
  email: string;
  perfil: {
    fotoPerfil?: string;
    nicknameAvatar?: string;
    fechaNacimiento?: string;
    genero?: string;
    horarioUso?: string;
    duracionUso?: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  paciente: PacienteData;
  diagnostico: string;
  estadisticasEmocionales: EstadisticaEmocional[];
}

// Componente de Gráfico Circular de Emoción (reutilizado del paciente)
const EmotionChart = ({
  nombre,
  cantidad,
  promedioNivelAfectacion,
  color,
  maxCantidad = 20,
}: {
  nombre: string;
  cantidad: number;
  promedioNivelAfectacion: number;
  color: string;
  maxCantidad?: number;
}) => {
  const percentage = Math.min((cantidad / maxCantidad) * 100, 100);
  const circumference = 2 * Math.PI * 45; // Radio de 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const filledDots = Math.round((percentage / 100) * 10);

  return (
    <div className="flex flex-col items-center">
      {/* Círculo de progreso */}
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-24 h-24 transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          {/* Círculo de progreso */}
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Porcentaje en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Dots de progreso */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300`}
            style={{
              backgroundColor: i < filledDots ? color : '#E5E7EB',
              transform: i < filledDots ? 'scale(1)' : 'scale(0.8)',
            }}
          />
        ))}
      </div>

      {/* Nombre de la emoción */}
      <span className="text-sm font-medium text-gray-600">{nombre}</span>

      {/* Promedio de afectación */}
      <span className="text-xs text-gray-500 mt-1">
        Afectación: {promedioNivelAfectacion.toFixed(1)}
      </span>
    </div>
  );
};

export default function PacientePage() {
  const router = useRouter();
  const params = useParams();
  const pacienteId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [pacienteData, setPacienteData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del paciente
  useEffect(() => {
    if (!pacienteId) {
      setError('ID de paciente inválido');
      setLoading(false);
      return;
    }

    const fetchPaciente = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/psicologo/paciente/${pacienteId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Paciente no encontrado');
          } else if (response.status === 403) {
            setError('No tienes permiso para ver este paciente');
          } else {
            setError('Error al cargar los datos del paciente');
          }
          setLoading(false);
          return;
        }

        const data: ApiResponse = await response.json();
        setPacienteData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching paciente:', err);
        setError('Error de conexión al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [pacienteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff]">
        <LoadingIndicator />
      </div>
    );
  }

  if (error || !pacienteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-md max-w-md">
          <p className="text-red-600 font-semibold mb-4">{error || 'Error al cargar los datos'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[var(--color-theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Calcular el máximo de cantidad para normalizar los gráficos
  const maxCantidad = Math.max(
    1,
    Math.max(...pacienteData.estadisticasEmocionales.map((e) => e.cantidad))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] pb-20">
      {/* Header con botón atrás */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-[var(--color-theme-primary)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">Volver</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">Base de datos del paciente</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Sección de Perfil del Paciente */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <ProfileHeader
            avatar={pacienteData.paciente.perfil?.fotoPerfil || '/assets/default-avatar.png'}
            nombre={pacienteData.paciente.nombreCompleto}
            nicknameAvatar={pacienteData.paciente.perfil?.nicknameAvatar || 'Sin nickname'}
          />
        </div>

        {/* Sección de Diagnóstico */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Diagnóstico
          </h2>
          <p className="text-gray-600">{pacienteData.diagnostico}</p>
        </div>

        {/* Sección de Estadísticas Emocionales */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Escala de estado emocional del mes
          </h2>

          {pacienteData.estadisticasEmocionales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay datos de emociones registrados en los últimos 30 días.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {pacienteData.estadisticasEmocionales.map((estadistica) => (
                <EmotionChart
                  key={estadistica.nombre}
                  nombre={estadistica.nombre}
                  cantidad={estadistica.cantidad}
                  promedioNivelAfectacion={estadistica.promedioNivelAfectacion}
                  color={estadistica.color}
                  maxCantidad={maxCantidad}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sección de Detalles del Perfil (Opcional) */}
        {pacienteData.paciente.perfil && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Información del Perfil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pacienteData.paciente.perfil.fechaNacimiento && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium text-gray-800">
                    {new Date(pacienteData.paciente.perfil.fechaNacimiento).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.genero && (
                <div>
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="font-medium text-gray-800">
                    {pacienteData.paciente.perfil.genero}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.horarioUso && (
                <div>
                  <p className="text-sm text-gray-500">Horario de Uso</p>
                  <p className="font-medium text-gray-800">
                    {pacienteData.paciente.perfil.horarioUso}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.duracionUso && (
                <div>
                  <p className="text-sm text-gray-500">Duración de Uso</p>
                  <p className="font-medium text-gray-800">
                    {pacienteData.paciente.perfil.duracionUso}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
