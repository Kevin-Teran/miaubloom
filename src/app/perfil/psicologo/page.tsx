'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfilePagination } from '@/components/profile/ProfilePagination';
import { EllipseCorner } from '@/components/EllipseCorner';

interface UserData {
  nombreCompleto: string;
  perfil?: {
    nicknameAvatar?: string;
    especialidad?: string;
    tituloUniversitario?: string;
    numeroRegistro?: string;
  };
}

export default function PerfilPsicologo() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({ nombreCompleto: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Opciones de horario
  const scheduleOptions = [
    { id: 'manana', label: 'Mañana (6:00 - 12:00)', description: 'Primeras horas del día' },
    { id: 'tarde', label: 'Tarde (12:00 - 18:00)', description: 'Después del mediodía' },
    { id: 'noche', label: 'Noche (18:00 - 24:00)', description: 'Últimas horas del día' },
    { id: 'madrugada', label: 'Madrugada (24:00 - 6:00)', description: 'Durante la madrugada' }
  ];

  // Opciones de duración
  const durationOptions = [
    { id: 'corta', label: 'Sesiones cortas (15-30 min)', description: 'Sesiones rápidas' },
    { id: 'media', label: 'Sesiones medias (30-60 min)', description: 'Duración estándar' },
    { id: 'larga', label: 'Sesiones largas (60+ min)', description: 'Sesiones extendidas' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/user');
        
        if (!response.ok) {
          throw new Error('No autorizado');
        }

        const data = await response.json();
        
        if (!data.success || !data.authenticated || data.user.rol !== 'Psicólogo') {
          router.push('/auth/login/psicologo');
          return;
        }

        setUserData({
          nombreCompleto: data.user.nombreCompleto,
          perfil: {
            nicknameAvatar: data.user.perfilPsicologo?.nicknameAvatar || 'psicólogo',
            especialidad: data.user.perfilPsicologo?.especialidad || '',
            tituloUniversitario: data.user.perfilPsicologo?.tituloUniversitario || '',
            numeroRegistro: data.user.perfilPsicologo?.identificacion || ''
          }
        });

        setSelectedSchedule(data.user.perfilPsicologo?.horarioUso || '');
        setSelectedDuration(data.user.perfilPsicologo?.duracionUso || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
        router.push('/auth/login/psicologo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsTransitioning(false);
    }, 200);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          horarioUso: selectedSchedule,
          duracionUso: selectedDuration
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el perfil');
      }

      router.push('/inicio/psicologo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-theme-primary-light)] to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-theme-primary)]"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-theme-primary-light)] to-white">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => router.push('/auth/login/psicologo')}
            className="mt-4 px-6 py-2 bg-[var(--color-theme-primary)] text-white rounded-full"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-theme-primary-light)] to-white overflow-x-hidden">
      <style jsx>{`
        :root {
          --color-theme-primary: #F1A8A9;
          --color-theme-primary-light: #FDE9E9;
          --color-theme-primary-dark: #E0898A;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --color-theme-primary: #F1A8A9;
            --color-theme-primary-light: #FDE9E9;
            --color-theme-primary-dark: #E0898A;
          }
        }
      `}</style>

      {/* Decoración de esquinas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EllipseCorner />
      </div>

      {/* Container principal - DESKTOP ONLY */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-8">
        
        {/* LAYOUT DESKTOP */}
        <div className="grid grid-cols-12 gap-8 pt-8">
          
          {/* COLUMNA IZQUIERDA: Header + Información Profesional */}
          <div className="col-span-4 space-y-6">
            {/* Header del Perfil */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-[var(--color-theme-primary)] hover:shadow-xl transition-shadow duration-300">
              <ProfileHeader
                nombre={userData.nombreCompleto}
                avatar="/assets/avatar-psicologo.png"
                nicknameAvatar={userData.perfil?.nicknameAvatar || 'psicólogo'}
              />
              
              {/* Información Profesional */}
              <div className="mt-8 space-y-4">
                {/* Identificación (read-only) */}
                <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 border-l-4 border-blue-300">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '14px' }}>
                    Identificación
                  </h3>
                  <p className="font-roboto text-gray-700 font-medium" style={{ fontSize: '16px' }}>
                    {userData.perfil?.numeroRegistro || 'No disponible'}
                  </p>
                </div>

                {/* Especialidad */}
                <div className="bg-gradient-to-r from-[var(--color-theme-primary-light)] to-transparent rounded-xl p-4 border-l-4 border-[var(--color-theme-primary)]">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '14px' }}>
                    Especialidad
                  </h3>
                  <p className="font-roboto text-gray-700 leading-tight" style={{ fontSize: '15px' }}>
                    {userData.perfil?.especialidad || 'No especificada'}
                  </p>
                </div>

                {/* Título Universitario */}
                <div className="bg-gradient-to-r from-purple-50 to-transparent rounded-xl p-4 border-l-4 border-purple-300">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '14px' }}>
                    Título Universitario
                  </h3>
                  <p className="font-roboto text-gray-700 leading-tight" style={{ fontSize: '15px' }}>
                    {userData.perfil?.tituloUniversitario || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <p className="font-roboto text-gray-500 text-sm" style={{ fontSize: '14px' }}>
                Configura tu disponibilidad
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: Formulario de Disponibilidad */}
          <div className="col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 border-t-4 border-[var(--color-theme-primary)] hover:shadow-2xl transition-shadow duration-300">
              
              {/* Header de la sección */}
              <div className="text-center mb-10">
                <div className="inline-block bg-gradient-to-r from-[var(--color-theme-primary-light)] to-transparent rounded-full px-6 py-2 mb-4">
                  <span className="font-roboto font-semibold text-[var(--color-theme-primary)]" style={{ fontSize: '15px' }}>
                    Paso {currentStep + 1} de 2
                  </span>
                </div>
                <h2 className="mb-3 font-roboto font-bold text-[var(--color-theme-primary)]" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
                  Personaliza
                </h2>
                <p className="font-roboto font-medium text-[#070806]" style={{ fontSize: '20px' }}>
                  Tu disponibilidad
                </p>
              </div>

              {/* Contenido con transición */}
              <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                
                {/* Paso 1: Horario de Disponibilidad */}
                {currentStep === 0 && (
                  <div className="space-y-8 fade-in-up">
                    <div>
                      <h3 className="font-roboto font-semibold text-[#070806] mb-6" style={{ fontSize: '18px' }}>
                        ¿En qué horario atiendes?
                      </h3>
                      <div className="space-y-4">
                        {scheduleOptions.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:border-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-light)]"
                            style={{
                              borderColor: selectedSchedule === option.id ? 'var(--color-theme-primary)' : '#e5e7eb',
                              backgroundColor: selectedSchedule === option.id ? 'var(--color-theme-primary-light)' : '#ffffff'
                            }}
                          >
                            <input
                              type="radio"
                              name="schedule"
                              value={option.id}
                              checked={selectedSchedule === option.id}
                              onChange={(e) => setSelectedSchedule(e.target.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-roboto font-semibold text-[#070806]" style={{ fontSize: '16px' }}>
                                {option.label}
                              </p>
                              <p className="font-roboto text-gray-500 text-sm mt-1">
                                {option.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ProfilePagination current={0} total={2} />
                    </div>
                  </div>
                )}

                {/* Paso 2: Duración de Sesiones */}
                {currentStep === 1 && (
                  <div className="space-y-8 fade-in-up">
                    <div>
                      <h3 className="font-roboto font-semibold text-[#070806] mb-6" style={{ fontSize: '18px' }}>
                        ¿Cuál es la duración de tus sesiones?
                      </h3>
                      <div className="space-y-4">
                        {durationOptions.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:border-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-light)]"
                            style={{
                              borderColor: selectedDuration === option.id ? 'var(--color-theme-primary)' : '#e5e7eb',
                              backgroundColor: selectedDuration === option.id ? 'var(--color-theme-primary-light)' : '#ffffff'
                            }}
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={option.id}
                              checked={selectedDuration === option.id}
                              onChange={(e) => setSelectedDuration(e.target.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-roboto font-semibold text-[#070806]" style={{ fontSize: '16px' }}>
                                {option.label}
                              </p>
                              <p className="font-roboto text-gray-500 text-sm mt-1">
                                {option.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ProfilePagination current={1} total={2} />
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de navegación */}
              <div className="flex items-center justify-between mt-10 gap-6">
                {currentStep > 0 ? (
                  <button
                    onClick={() => handleStepChange(currentStep - 1)}
                    className="group flex items-center gap-2 px-8 py-4 rounded-full font-roboto font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    style={{ fontSize: '17px', color: '#070806', backgroundColor: '#B6BABE' }}
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Atrás
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 1 ? (
                  <button
                    onClick={() => handleStepChange(currentStep + 1)}
                    className="group flex items-center gap-2 ml-auto px-10 py-4 rounded-full font-roboto font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    style={{ fontSize: '17px', color: '#FFFFFF', backgroundColor: 'var(--color-theme-primary)' }}
                  >
                    Siguiente
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    className="group flex items-center gap-2 ml-auto px-10 py-4 rounded-full font-roboto font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    style={{ fontSize: '17px', color: '#FFFFFF', backgroundColor: 'var(--color-theme-primary)' }}
                  >
                    Comenzar
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }

        /* Smooth transitions para botones */
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:hover {
          filter: brightness(0.95);
        }

        /* Focus states mejorados */
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid var(--color-theme-primary);
          outline-offset: 3px;
        }

        /* Reducir animaciones para usuarios con preferencias */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
