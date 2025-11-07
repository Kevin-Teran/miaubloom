"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { SuccessToast } from '@/components/ui/SuccessToast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Edit2, Save } from 'lucide-react';
import { useRouteProtection } from '@/hooks/useRouteProtection';

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
    diagnostico?: string;
    duracionTratamiento?: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  paciente: PacienteData;
  estadisticasEmocionales: EstadisticaEmocional[];
}

interface DiagFormData {
  diagnostico: string;
  duracionTratamiento: string;
}

// Componente de Gráfico Circular de Emoción (CORREGIDO - Variables CSS)
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
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const filledDots = Math.round((percentage / 100) * 10);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-3xl shadow-sm border transition-all hover:shadow-md" style={{ borderColor: 'var(--color-theme-primary-light)' }}>
      {/* Círculo de progreso */}
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-28 h-28 transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="var(--color-theme-primary-light)"
            strokeWidth="10"
            fill="none"
          />
          {/* Círculo de progreso */}
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Porcentaje en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-[#070806]">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Dots de progreso */}
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300`}
            style={{
              backgroundColor: i < filledDots ? color : 'var(--color-theme-primary)',
              opacity: i < filledDots ? 1 : 0.3,
              transform: i < filledDots ? 'scale(1)' : 'scale(0.8)',
            }}
          />
        ))}
      </div>

      {/* Nombre de la emoción */}
      <span className="text-base font-semibold text-[#070806] mb-1">{nombre}</span>

      {/* Promedio de afectación */}
      <div className="text-xs px-3 py-1.5 rounded-full" style={{ 
        backgroundColor: 'var(--color-theme-primary-light)',
        color: 'var(--color-theme-primary-dark)'
      }}>
        Nivel: {promedioNivelAfectacion.toFixed(1)}
      </div>
    </div>
  );
};

export default function PacientePage() {
  const router = useRouter();
  const params = useParams();
  const pacienteId = params?.id as string;
  
  const { user, isLoading: isAuthLoading } = useRouteProtection(['Psicólogo']);

  const [loading, setLoading] = useState(true);
  const [pacienteData, setPacienteData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [diagData, setDiagData] = useState<DiagFormData>({ diagnostico: '', duracionTratamiento: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchPaciente = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/psicologo/paciente/${pacienteId}`, {
        credentials: 'include'
      });

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
      setDiagData({
        diagnostico: data.paciente.perfil?.diagnostico || '',
        duracionTratamiento: data.paciente.perfil?.duracionTratamiento || '',
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching paciente:', err);
      setError('Error de conexión al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiagData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveDiagnostico = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const response = await fetch(`/api/psicologo/paciente/${pacienteId}/diagnostico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(diagData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
      fetchPaciente();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!pacienteId) {
      setError('ID de paciente inválido');
      setLoading(false);
      return;
    }
    if (user) {
      fetchPaciente();
    }
  }, [pacienteId, fetchPaciente, user]);

  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingIndicator text="Cargando datos del paciente..." />
      </div>
    );
  }

  if (error || !pacienteData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-red-200 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold mb-6">{error || 'Error al cargar los datos'}</p>
          <button
            onClick={() => router.back()}
            style={{ backgroundColor: 'var(--color-theme-primary)' }}
            className="px-6 py-3 text-white rounded-2xl hover:opacity-90 transition-all font-semibold shadow-sm"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const maxCantidad = Math.max(
    1,
    Math.max(...pacienteData.estadisticasEmocionales.map((e) => e.cantidad))
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header - DESKTOP (CORREGIDO) */}
      <div className="hidden md:block sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm" style={{ borderBottom: `1px solid var(--color-theme-primary-light)` }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2.5 text-[#070806] transition-colors font-semibold hover:opacity-75"
            style={{ color: 'var(--color-theme-primary)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
          <h1 className="text-lg font-bold text-[#070806]">Base de datos del paciente</h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Header Mobile (CORREGIDO) */}
      <div 
        className="md:hidden sticky top-0 z-10 px-4 py-3 rounded-b-3xl shadow-lg"
        style={{ background: `linear-gradient(135deg, var(--color-theme-primary-light) 0%, var(--color-theme-primary) 100%)` }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        
        {/* Card Mobile "Mis pacientes" (CORREGIDO) */}
        <div className="md:hidden bg-white rounded-3xl shadow-sm p-5" style={{ border: `1px solid var(--color-theme-primary-light)` }}>
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-theme-primary)' }}>Mis pacientes</h2>
          
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: `2px solid var(--color-theme-primary-light)` }}>
              <Image 
                src={pacienteData.paciente.perfil?.fotoPerfil || '/assets/default-avatar.png'}
                alt={pacienteData.paciente.nombreCompleto}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#070806] text-base mb-1 truncate">
                {pacienteData.paciente.nombreCompleto}
              </h3>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-theme-primary)' }}>
                Diagnóstico: {diagData.duracionTratamiento || 'No definido'}
              </p>
              <p className="text-xs text-[#B6BABE] leading-relaxed line-clamp-3">
                {diagData.diagnostico || 'Sin diagnóstico registrado'}
              </p>
            </div>
          </div>

          <button className="mt-4 w-full font-semibold py-3 rounded-2xl text-sm transition-all text-white" style={{ backgroundColor: 'var(--color-theme-primary-light)', color: 'var(--color-theme-primary)' }}>
            Último comentario
          </button>
        </div>

        {/* Sección de Perfil del Paciente - DESKTOP (CORREGIDO) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8" style={{ border: `1px solid var(--color-theme-primary-light)` }}>
          <ProfileHeader
            avatar={pacienteData.paciente.perfil?.fotoPerfil || '/assets/default-avatar.png'}
            nombre={pacienteData.paciente.nombreCompleto}
            nicknameAvatar={pacienteData.paciente.perfil?.nicknameAvatar || 'Sin nickname'}
          />
        </div>

        {/* Sección de Diagnóstico - DESKTOP (CORREGIDO) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8" style={{ border: `1px solid var(--color-theme-primary-light)` }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#070806]">Diagnóstico</h2>
              <p className="text-sm text-[#B6BABE]">Información clínica del paciente</p>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  type="text"
                  name="diagnostico"
                  placeholder="Ingresa el diagnóstico"
                  value={diagData.diagnostico}
                  onChange={handleEditChange}
                  className="w-full focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]"
                />
                <Input
                  type="text"
                  name="duracionTratamiento"
                  placeholder="Ej: 6 meses"
                  value={diagData.duracionTratamiento}
                  onChange={handleEditChange}
                  className="w-full focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]"
                />
                {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveDiagnostico}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save size={16} />
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[#070806] leading-relaxed mb-3">{diagData.diagnostico || 'No definido'}</p>
                <p className="text-sm text-[#B6BABE] mb-4">Duración estimada: {diagData.duracionTratamiento || 'No definida'}</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                  variant="outline"
                  style={{ color: 'var(--color-theme-primary)' }}
                >
                  <Edit2 size={16} />
                  Editar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Estadísticas Emocionales (CORREGIDO) */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-8" style={{ border: `1px solid var(--color-theme-primary-light)` }}>
          <div className="hidden md:flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#070806]">Escala de estado emocional</h2>
              <p className="text-sm text-[#B6BABE]">Últimos 30 días</p>
            </div>
          </div>

          {/* Grid Desktop (o sin datos) */}
          {pacienteData.estadisticasEmocionales.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">😊</span>
              </div>
              <p className="text-[#B6BABE] font-medium">
                No hay datos de emociones registrados en los últimos 30 días
              </p>
            </div>
          ) : (
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

          {/* Botón Desktop (CORREGIDO) */}
          <div className="md:block hidden mt-6">
            <button className="w-full font-semibold py-3 rounded-2xl text-sm transition-all text-white" style={{ backgroundColor: 'var(--color-theme-primary-light)', color: 'var(--color-theme-primary)' }}>
              Último comentario
            </button>
          </div>
        </div>

        {/* Sección de Detalles del Perfil - Solo Desktop (CORREGIDO) */}
        {pacienteData.paciente.perfil && (
          <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8" style={{ border: `1px solid var(--color-theme-primary-light)` }}>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#070806]">Información del Perfil</h2>
                <p className="text-sm text-[#B6BABE]">Datos personales y configuración</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pacienteData.paciente.perfil.fechaNacimiento && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Fecha de Nacimiento</p>
                  <p className="font-semibold text-[#070806]">
                    {new Date(pacienteData.paciente.perfil.fechaNacimiento).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.genero && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Género</p>
                  <p className="font-semibold text-[#070806]">
                    {pacienteData.paciente.perfil.genero}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.horarioUso && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Horario de Uso</p>
                  <p className="font-semibold text-[#070806]">
                    {pacienteData.paciente.perfil.horarioUso}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.duracionUso && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Duración de Uso</p>
                  <p className="font-semibold text-[#070806]">
                    {pacienteData.paciente.perfil.duracionUso}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <SuccessToast message="¡Diagnóstico actualizado exitosamente!" isOpen={showSuccess} />
    </div>
  );
}
