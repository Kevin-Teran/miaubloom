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

// Componente de Gráfico Circular de Emoción mejorado
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
    <div className="flex flex-col items-center p-4 bg-white rounded-3xl shadow-sm border border-[#F2C2C1]/20 hover:shadow-md transition-all">
      {/* Círculo de progreso */}
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-28 h-28 transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="#FFF5F5"
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
              backgroundColor: i < filledDots ? color : '#F2C2C1',
              opacity: i < filledDots ? 1 : 0.3,
              transform: i < filledDots ? 'scale(1)' : 'scale(0.8)',
            }}
          />
        ))}
      </div>

      {/* Nombre de la emoción */}
      <span className="text-base font-semibold text-[#070806] mb-1">{nombre}</span>

      {/* Promedio de afectación */}
      <div className="text-xs text-[#B6BABE] bg-[#FFF5F5] px-3 py-1.5 rounded-full">
        Nivel: {promedioNivelAfectacion.toFixed(1)}
      </div>
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
  
  // Estados para edición de diagnóstico
  const [isEditing, setIsEditing] = useState(false);
  const [diagData, setDiagData] = useState<DiagFormData>({ diagnostico: '', duracionTratamiento: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar datos del paciente
  const fetchPaciente = useCallback(async () => {
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
      // Cargar datos en el formulario de edición
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
        body: JSON.stringify(diagData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar');
      }

      // Éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
      // Refrescar los datos
      fetchPaciente();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (!pacienteId) {
      setError('ID de paciente inválido');
      setLoading(false);
      return;
    }

    fetchPaciente();
  }, [pacienteId, fetchPaciente]);

  if (loading) {
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
            className="px-6 py-3 bg-[#F2C2C1] text-white rounded-2xl hover:bg-[#F2C2C1]/90 transition-all font-semibold shadow-sm"
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header - RESPONSIVE: Oculto en mobile, visible en desktop */}
      <div className="hidden md:block sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#F2C2C1]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2.5 text-[#070806] hover:text-[#F2C2C1] transition-colors font-semibold"
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

      {/* Header Mobile con Miau - RESPONSIVE: Solo visible en mobile */}
      <div className="md:hidden sticky top-0 z-10 bg-gradient-to-r from-[#F2C2C1] to-[#F5B8B7] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        {/* Texto y Miau */}
        <div className="flex items-start justify-between">
          <div className="text-white">
            <p className="text-xs opacity-80 mb-1">Hoy hay muchas emociones</p>
            <p className="text-lg font-bold">Empecemos</p>
          </div>
          <div className="w-24 h-24 relative">
            {/* Miau Avatar placeholder */}
            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Fecha */}
        <div className="mt-3 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2 w-fit">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-white font-medium">
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Card Mobile "Mis pacientes" - RESPONSIVE: Solo visible en mobile */}
        <div className="md:hidden bg-white rounded-3xl shadow-sm p-5 border border-[#F2C2C1]/20">
          <h2 className="text-base font-bold text-[#F2C2C1] mb-4">Mis pacientes</h2>
          
          {/* Card del Paciente */}
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-[#F2C2C1]/30">
              <Image 
                src={pacienteData.paciente.perfil?.fotoPerfil || '/assets/default-avatar.png'}
                alt={pacienteData.paciente.nombreCompleto}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#070806] text-base mb-1 truncate">
                {pacienteData.paciente.nombreCompleto}
              </h3>
              <p className="text-sm text-[#F2C2C1] font-semibold mb-2">
                Diagnóstico: {diagData.duracionTratamiento || 'No definido'}
              </p>
              <p className="text-xs text-[#B6BABE] leading-relaxed line-clamp-3">
                {diagData.diagnostico || 'Sin diagnóstico registrado'}
              </p>
            </div>
          </div>

          {/* Botón último comentario - visible solo en mobile */}
          <button className="mt-4 w-full bg-[#FFF5F5] text-[#F2C2C1] font-semibold py-3 rounded-2xl text-sm hover:bg-[#F2C2C1] hover:text-white transition-all">
            Último comentario
          </button>
        </div>

        {/* Sección de Perfil del Paciente - DESKTOP */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8 border border-[#F2C2C1]/20">
          <ProfileHeader
            avatar={pacienteData.paciente.perfil?.fotoPerfil || '/assets/default-avatar.png'}
            nombre={pacienteData.paciente.nombreCompleto}
            nicknameAvatar={pacienteData.paciente.perfil?.nicknameAvatar || 'Sin nickname'}
          />
        </div>

        {/* Sección de Diagnóstico - DESKTOP */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8 border border-[#F2C2C1]/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FFF5F5] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#070806]">Diagnóstico</h2>
              <p className="text-sm text-[#B6BABE]">Información clínica del paciente</p>
            </div>
          </div>
          <div className="bg-[#FFF5F5] rounded-2xl p-5">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  type="text"
                  name="diagnostico"
                  placeholder="Ingresa el diagnóstico"
                  value={diagData.diagnostico}
                  onChange={handleEditChange}
                  className="w-full"
                />
                <Input
                  type="text"
                  name="duracionTratamiento"
                  placeholder="Ej: 6 meses"
                  value={diagData.duracionTratamiento}
                  onChange={handleEditChange}
                  className="w-full"
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
                  className="flex items-center gap-2 text-[#F2C2C1]"
                  variant="outline"
                >
                  <Edit2 size={16} />
                  Editar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Estadísticas Emocionales */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-8 border border-[#F2C2C1]/20">
          {/* Header solo desktop */}
          <div className="hidden md:flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFF5F5] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#070806]">Escala de estado emocional</h2>
              <p className="text-sm text-[#B6BABE]">Últimos 30 días</p>
            </div>
          </div>

          {/* Gráfico Circular Mobile */}
          <div className="md:hidden mb-4">
            <div className="relative w-40 h-40 mx-auto">
              {/* SVG del gráfico de dona */}
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {pacienteData.estadisticasEmocionales.map((emocion, index) => {
                  const total = pacienteData.estadisticasEmocionales.reduce((sum, e) => sum + e.cantidad, 0);
                  const percentage = (emocion.cantidad / total) * 100;
                  const circumference = 2 * Math.PI * 70;
                  const offset = pacienteData.estadisticasEmocionales
                    .slice(0, index)
                    .reduce((sum, e) => sum + ((e.cantidad / total) * circumference), 0);
                  const strokeLength = (percentage / 100) * circumference;
                  
                  return (
                    <circle
                      key={emocion.nombre}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke={emocion.color}
                      strokeWidth="25"
                      strokeDasharray={`${strokeLength} ${circumference}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Lista de emociones - Mobile */}
          <div className="md:hidden space-y-2 mb-4">
            {pacienteData.estadisticasEmocionales.slice(0, 3).map((emocion) => (
              <div key={emocion.nombre} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: emocion.color }}
                  />
                  <span className="text-sm font-medium text-[#070806]">{emocion.nombre}</span>
                </div>
                <span className="text-xs text-[#B6BABE]">{emocion.cantidad}</span>
              </div>
            ))}
          </div>

          {/* Grid Desktop */}
          {pacienteData.estadisticasEmocionales.length === 0 ? (
            <div className="text-center py-12 bg-[#FFF5F5] rounded-2xl">
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

          {/* Botón último comentario desktop dentro de estadísticas */}
          <div className="md:block hidden mt-6">
            <button className="w-full bg-[#FFF5F5] text-[#F2C2C1] font-semibold py-3 rounded-2xl text-sm hover:bg-[#F2C2C1] hover:text-white transition-all">
              Último comentario
            </button>
          </div>
        </div>

        {/* Sección de Detalles del Perfil - Solo Desktop */}
        {pacienteData.paciente.perfil && (
          <div className="hidden md:block bg-white rounded-3xl shadow-sm p-8 border border-[#F2C2C1]/20">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFF5F5] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#070806]">Información del Perfil</h2>
                <p className="text-sm text-[#B6BABE]">Datos personales y configuración</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pacienteData.paciente.perfil.fechaNacimiento && (
                <div className="bg-[#FFF5F5] rounded-2xl p-4">
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
                <div className="bg-[#FFF5F5] rounded-2xl p-4">
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Género</p>
                  <p className="font-semibold text-[#070806]">
                    {pacienteData.paciente.perfil.genero}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.horarioUso && (
                <div className="bg-[#FFF5F5] rounded-2xl p-4">
                  <p className="text-xs text-[#B6BABE] mb-1 font-medium">Horario de Uso</p>
                  <p className="font-semibold text-[#070806]">
                    {pacienteData.paciente.perfil.horarioUso}
                  </p>
                </div>
              )}
              {pacienteData.paciente.perfil.duracionUso && (
                <div className="bg-[#FFF5F5] rounded-2xl p-4">
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