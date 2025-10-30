"use client";

/**
 * @file page.tsx
 * @route src/app/perfil/paciente/page.tsx
 * @description Página de perfil personalización del paciente - VERSIÓN MEJORADA
 * @version 2.0.0
 * 
 * Diseño System Mejorado:
 * - Heading 1: 32px Bold (Desktop) / 28px (Mobile)
 * - Heading 2: 20px SemiBold (Desktop) / 18px (Mobile)
 * - Text Body 1: 17px Medium (Desktop) / 16px (Mobile)
 * - Text Body 2: 15px Regular (Desktop) / 14px (Mobile)
 * - Font: Roboto
 * 
 * Colores:
 * - Primary: var(--color-theme-primary) (Rosa/Azul dinámico)
 * - Primary Hover: var(--color-theme-primary-dark) (Rosa/Azul oscuro dinámico)
 * - Dark: #070806 (Gris oscuro)
 * - Secondary: #B6BABE (Gris claro)
 * - Background: #FAFAFA (Gris muy claro)
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UsageSchedule } from '@/components/profile/UsageSchedule';
import { UsageDuration } from '@/components/profile/UsageDuration';
import { ProfilePagination } from '@/components/profile/ProfilePagination';
import { EllipseCorner } from '@/components/EllipseCorner';

interface UserData {
  nombreCompleto: string;
  perfil?: {
    nicknameAvatar?: string;
  };
}

export default function PacienteProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState('3-8');
  const [selectedDuration, setSelectedDuration] = useState('3-8');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/login');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.authenticated) {
            setUserData(data.user);
          } else {
            router.push('/auth/login/paciente');
          }
        } else {
          router.push('/auth/login/paciente');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login/paciente');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <LoadingIndicator 
          text="Cargando tu perfil..." 
          className="[&>p]:text-gray-600 [&>div]:opacity-50" 
        />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-16 relative">
      {/* Franja rosa decorativa - Detrás de todo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EllipseCorner />
      </div>

      {/* Container principal con diferentes layouts para móvil y desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* LAYOUT DESKTOP: Grid de 2 columnas */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-8">
          
          {/* COLUMNA IZQUIERDA: Header + Información */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header del Perfil con mejor diseño */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-[var(--color-theme-primary)] hover:shadow-xl transition-shadow duration-300">
              <ProfileHeader
                nombre={userData.nombreCompleto}
                avatar="/assets/avatar-paciente.png"
                nicknameAvatar={userData.perfil?.nicknameAvatar || 'usuario'}
              />
              
              {/* Información adicional del perfil */}
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r from-[var(--color-theme-primary-light)] to-transparent rounded-xl p-4 border-l-4 border-[var(--color-theme-primary)]">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '17px' }}>
                    ¿Por qué personalizar?
                  </h3>
                  <p className="font-roboto text-gray-600 leading-relaxed" style={{ fontSize: '15px' }}>
                    Configurar tu horario y duración nos ayuda a crear una experiencia adaptada a tu ritmo de vida.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-xl p-4 border-l-4 border-blue-300">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '17px' }}>
                    Progreso
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
                      />
                    </div>
                    <span className="font-roboto font-semibold text-[var(--color-theme-primary)]" style={{ fontSize: '15px' }}>
                      {currentStep + 1}/2
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <p className="font-roboto text-gray-500 text-sm" style={{ fontSize: '14px' }}>
                Personaliza tu experiencia
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: Formulario de personalización */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-t-4 border-[var(--color-theme-primary)] hover:shadow-2xl transition-shadow duration-300">
              
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
                  Tu perfil
                </p>
              </div>

              {/* Contenido con transición */}
              <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                
                {/* Paso 1: Horario de Uso */}
                {currentStep === 0 && (
                  <div className="space-y-8 fade-in-up">
                    <UsageSchedule
                      selectedSchedule={selectedSchedule}
                      onScheduleChange={setSelectedSchedule}
                    />
                    <div className="flex justify-center">
                      <ProfilePagination current={0} total={2} />
                    </div>
                  </div>
                )}

                {/* Paso 2: Duración de Uso */}
                {currentStep === 1 && (
                  <div className="space-y-8 fade-in-up">
                    <UsageDuration
                      selectedDuration={selectedDuration}
                      onDurationChange={setSelectedDuration}
                    />
                    <div className="flex justify-center">
                      <ProfilePagination current={1} total={2} />
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de navegación mejorados */}
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
                    onClick={() => router.push('/inicio/paciente')}
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

        {/* LAYOUT MÓVIL: Diseño vertical tradicional */}
        <div className="lg:hidden">
          {/* Header del Perfil */}
          <div className="pt-6">
            <ProfileHeader
              nombre={userData.nombreCompleto}
              avatar="/assets/avatar-paciente.png"
              nicknameAvatar={userData.perfil?.nicknameAvatar || 'usuario'}
            />
          </div>

          {/* Contenedor Principal */}
          <div className="mt-6 rounded-3xl shadow-lg p-6 bg-white border-t-4 border-[var(--color-theme-primary)]">
            
            {/* Título de Sección */}
            <div className="text-center mb-8">
              <div className="inline-block bg-pink-50 rounded-full px-5 py-1.5 mb-3">
                <span className="font-roboto font-semibold text-[var(--color-theme-primary)]" style={{ fontSize: '14px' }}>
                  Paso {currentStep + 1} de 2
                </span>
              </div>
              <h2 className="mb-2 font-roboto font-bold text-[var(--color-theme-primary)]" style={{ fontSize: '28px' }}>
                Personaliza
              </h2>
              <p className="font-roboto font-medium text-[#070806]" style={{ fontSize: '18px' }}>
                Tu perfil
              </p>
            </div>

            {/* Barra de progreso móvil */}
            <div className="mb-8">
              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
                  />
                </div>
                <span className="font-roboto font-semibold text-[var(--color-theme-primary)] px-2" style={{ fontSize: '14px' }}>
                  {currentStep + 1}/2
                </span>
              </div>
            </div>

            {/* Contenido con transición */}
            <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {/* Paso 1: Horario de Uso */}
              {currentStep === 0 && (
                <div className="fade-in-up">
                  <UsageSchedule
                    selectedSchedule={selectedSchedule}
                    onScheduleChange={setSelectedSchedule}
                  />
                  <div className="mt-6 flex justify-center">
                    <ProfilePagination current={0} total={2} />
                  </div>
                </div>
              )}

              {/* Paso 2: Duración de Uso */}
              {currentStep === 1 && (
                <div className="fade-in-up">
                  <UsageDuration
                    selectedDuration={selectedDuration}
                    onDurationChange={setSelectedDuration}
                  />
                  <div className="mt-6 flex justify-center">
                    <ProfilePagination current={1} total={2} />
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Navegación Móvil */}
            <div className="flex items-center justify-between mt-8 gap-4">
              {currentStep > 0 && (
                <button
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full font-roboto font-semibold transition-all duration-300 active:scale-95 shadow-md"
                  style={{ fontSize: '16px', color: '#070806', backgroundColor: '#B6BABE' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Atrás
                </button>
              )}

              {currentStep < 1 ? (
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="flex items-center gap-2 ml-auto px-8 py-3.5 rounded-full font-roboto font-semibold transition-all duration-300 active:scale-95 shadow-lg text-white"
                  style={{ fontSize: '16px', backgroundColor: 'var(--color-theme-primary)' }}
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => router.push('/inicio/paciente')}
                  className="flex items-center gap-2 ml-auto px-8 py-3.5 rounded-full font-roboto font-semibold transition-all duration-300 active:scale-95 shadow-lg text-white"
                  style={{ fontSize: '16px', backgroundColor: 'var(--color-theme-primary)' }}
                >
                  Comenzar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Footer Móvil */}
          <div className="text-center mt-8">
            <p className="font-roboto text-gray-500 text-sm" style={{ fontSize: '14px' }}>
              Personaliza tu experiencia
            </p>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
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

        /* Animación del gradiente de fondo */
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
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