/**
 * @file page.tsx
 * @route src/app/bienvenido/page.tsx
 * @description Flujo de bienvenida para Pacientes - VERSIÓN MEJORADA DESKTOP + MOBILE
 * @author Kevin Mariano
 * @version 4.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { EllipseCorner } from '@/components/EllipseCorner';

/**
 * @interface OnboardingStep
 * @description Estructura de cada paso del onboarding
 */
interface OnboardingStep {
  image: string;
  title: string;
  text: string;
  buttonText?: string;
  showLogo?: boolean;
  isFullBackground?: boolean;
}

/**
 * @interface Dot
 * @description Punto decorativo animado
 */
interface Dot {
  id: number;
  style: React.CSSProperties;
}

/**
 * Configuración de los pasos del onboarding
 */
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    image: '/assets/jardinero.png',
    title: '¡Bienvenido/a a MiauBloom!',
    text: 'Aquí tu jardín emocional crecerá junto a ti.',
    buttonText: 'Comenzar',
    isFullBackground: true,
  },
  {
    image: '/assets/gato-inicio-1.png',
    title: 'Soy Miau',
    text: 'Tu compañero jardinero. Te acompañaré para reconocer y cuidar tus emociones cada día.',
    buttonText: 'Siguiente',
    showLogo: true,
  },
  {
    image: '/assets/gato-inicio-2.png',
    title: 'Inicia sesión',
    text: 'Para empezar a nutrir tu jardín y avanzar hacia tu bienestar emocional.',
    showLogo: false,
  },
];

const THEME_COLOR = 'var(--color-theme-primary)';

/**
 * @component PaginationDots
 * @description Indicadores de progreso con animación mejorada
 */
function PaginationDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`rounded-full transition-all duration-500 ease-out ${
            index === current 
              ? 'w-10 h-2.5 bg-[var(--color-theme-primary)] shadow-md'  
              : 'w-2.5 h-2.5 bg-[var(--color-theme-primary-light)] hover:bg-gray-300 cursor-pointer'  
          }`}
        />
      ))}
    </div>
  );
}

/**
 * @component BienvenidoPage
 * @description Página principal del flujo de bienvenida con composición mejorada
 */
export default function BienvenidoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState<Dot[]>([]);
  const catRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const stepData = ONBOARDING_STEPS[currentStep];
  const totalSteps = ONBOARDING_STEPS.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Generar puntos decorativos
  useEffect(() => {
    const generatedDots: Dot[] = [];
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 4 + 2;
      generatedDots.push({
        id: i,
        style: {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-bubble ${Math.random() * 15 + 12}s infinite ease-in-out alternate`,
          animationDelay: `${Math.random() * 10}s`,
          zIndex: 0,
        },
      });
    }
    setDots(generatedDots);
  }, []);

  /**
   * Animación de entrada del gato con GSAP
   */
  useEffect(() => {
    if (catRef.current && !isFirstStep) {
      gsap.fromTo(
        catRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
          delay: 0.1,
        }
      );
    }

    if (textRef.current && !isFirstStep) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }

    if (contentRef.current && !isFirstStep) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { 
          opacity: 1, 
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }
  }, [currentStep, isFirstStep]);

  /**
   * Navegación con animación mejorada
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      // Animación de salida
      if (catRef.current) {
        gsap.to(catRef.current, {
          opacity: 0,
          scale: 0.9,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // Animación de salida
      if (catRef.current) {
        gsap.to(catRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
      
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 300);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleLogin = () => {
    router.push('/auth/login/paciente');
  };

  /**
   * PASO 1: Pantalla de bienvenida con fondo completo
   */
  if (isFirstStep) {
    return (
      <>
        {/* ============================================
            VERSIÓN MÓVIL - PASO 1
        ============================================ */}
        <div className="lg:hidden flex flex-col h-screen bg-white relative overflow-hidden">
          
          {/* FRANJA ROSA DECORATIVA */}
          <EllipseCorner />

          {/* FONDO: Color blanco rosado */}
          <div className="absolute inset-0 z-0 bg-white"></div>

          {/* FONDO: Imagen del jardín 3D */}
          <div className="absolute inset-0 z-1 flex items-start justify-center -mt-32">
            <Image
              src="/assets/jardinero.png"
              alt="Jardín Emocional"
              fill
              className="object-contain brightness-95 scale-125"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
          </div>

          {/* LOGO MIAUBLOOM */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-20 text-center opacity-0 animate-[fadeIn_1s_ease-in-out_0.5s_forwards]">
            <div className="relative w-48 h-48 drop-shadow-2xl">
              <Image 
                src="/assets/MiauBloom-b.svg" 
                alt="Miau Bloom Logo" 
                fill 
                className="object-contain drop-shadow-2xl" 
                unoptimized 
              />
            </div>
          </div>

          {/* TARJETA BLANCA INFERIOR */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[45px] shadow-2xl p-8 pb-12 animate-slide-up translate-y-12">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 opacity-40" />
            
            <h1 
              className="text-[32px] font-bold text-center mb-5 leading-tight tracking-tight"
              style={{ color: 'var(--color-theme-primary)' }}
            >
              {stepData.title}
            </h1>
            
            <p className="text-gray-600 text-center text-[17px] leading-relaxed mb-10 px-4 max-w-md mx-auto">
              {stepData.text}
            </p>

            <div className="flex items-center justify-between px-2 gap-4 w-full">
              <div className="flex-1">
                <PaginationDots current={currentStep} total={totalSteps} />
              </div>
              
              <button
                onClick={handleNext}
                className="px-12 py-4 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none whitespace-nowrap"
                style={{ backgroundColor: 'var(--color-theme-primary)' }}
              >
                {stepData.buttonText}
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            
            .animate-slide-up {
              animation: slide-up 0.6s ease-out;
            }
          `}</style>
        </div>

        {/* ============================================
            VERSIÓN DESKTOP - PASO 1
        ============================================ */}
        <div className="hidden lg:flex h-screen bg-white relative overflow-hidden">
          
          {/* FRANJA ROSA DECORATIVA */}
          <EllipseCorner />

          {/* Decoración de fondo */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.1 }}></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.15 }}></div>
          </div>

          {/* Partículas flotantes */}
          <div className="absolute inset-0 z-1">
            {dots.map((dot) => (
              <div key={dot.id} style={dot.style}>
                <div className="w-full h-full rounded-full" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.2 }} />
              </div>
            ))}
          </div>

          {/* Contenedor principal - Grid asimétrico */}
          <div className="relative z-10 w-full h-full flex items-center">
            
            {/* COLUMNA IZQUIERDA: Imagen del jardín (más grande y pegada) */}
            <div className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-start pl-0 relative">
              <div className="relative w-full h-full opacity-0 animate-[fadeInLeft_1s_ease-out_0.2s_forwards]">
                <Image
                  src="/assets/jardinero.png"
                  alt="Jardín Emocional"
                  fill
                  className="object-cover object-left drop-shadow-2xl"
                  priority
                  unoptimized
                />
              </div>
              
              {/* Logo flotante - Encima del paisaje */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 opacity-0 animate-[fadeInScale_1s_ease-out_0.8s_forwards] z-20">
                <div className="relative w-48 h-48 drop-shadow-2xl animate-float-gentle">
                  <Image 
                    src="/assets/MiauBloom-b.svg" 
                    alt="Miau Bloom Logo" 
                    fill 
                    className="object-contain" 
                    unoptimized 
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Contenido (posicionada a la derecha) */}
            <div className="absolute right-0 top-0 h-full w-1/2 flex flex-col justify-center space-y-8 opacity-0 animate-[fadeInRight_1s_ease-out_0.4s_forwards] px-12 pr-16">
              
              {/* Título principal */}
              <div className="space-y-4">
                <h1 
                  className="text-6xl font-bold leading-tight tracking-tight"
                  style={{ color: 'var(--color-theme-primary)' }}
                >
                  {stepData.title}
                </h1>
                
                <p className="text-gray-600 text-2xl leading-relaxed max-w-xl">
                  {stepData.text}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-[var(--color-theme-primary-light)] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[var(--color-theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Cuida tus emociones</h3>
                  <p className="text-gray-600 text-sm">Reconoce y gestiona tus sentimientos día a día</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-[var(--color-theme-primary-light)] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[var(--color-theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Haz crecer tu jardín</h3>
                  <p className="text-gray-600 text-sm">Observa cómo florece tu bienestar emocional</p>
                </div>
              </div>

              {/* Footer con paginación y botón */}
              <div className="flex items-center justify-between pt-8 max-w-2xl">
                <PaginationDots current={currentStep} total={totalSteps} />
                
                <button
                  onClick={handleNext}
                  className="group px-12 py-5 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 select-none flex items-center gap-3"
                  style={{ backgroundColor: 'var(--color-theme-primary)' }}
                >
                  <span>{stepData.buttonText}</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeInLeft {
              from { opacity: 0; transform: translateX(-50px); }
              to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes fadeInRight {
              from { opacity: 0; transform: translateX(50px); }
              to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
              to { opacity: 1; transform: scale(1) rotate(0deg); }
            }

            @keyframes float-gentle {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-15px) rotate(5deg); }
            }

            .animate-float-gentle {
              animation: float-gentle 4s ease-in-out infinite;
            }

            @keyframes float-bubble {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(-20px) translateX(10px); }
            }
          `}</style>
        </div>
      </>
    );
  }

  /**
   * PASOS 2 Y 3: Composición mejorada
   */
  return (
    <>
      {/* ============================================
          VERSIÓN MÓVIL - PASOS 2 Y 3
      ============================================ */}
      <div className="lg:hidden flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">

        {/* FRANJA ROSA DECORATIVA */}
        <EllipseCorner />

        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {dots.map((dot) => (
            <div key={dot.id} style={dot.style}>
              <div className="w-full h-full rounded-full" style={{ backgroundColor: 'var(--color-theme-primary)', opacity: 0.2 }} />
            </div>
          ))}
        </div>

        {/* Contenido Principal */}
        <main className="relative z-10 flex flex-col h-full justify-between p-6 pt-16 pb-10">

          {/* Botón Anterior */}
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="group absolute top-6 left-6 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-theme-primary)] transition-all duration-300 hover:scale-110 active:scale-95 z-20 shadow-md"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Gato + Logo */}
          <div className="relative w-full flex-grow flex items-center justify-center gap-8 px-6">
            <div 
              ref={catRef}
              className={`relative transition-all duration-500 ${
                isLastStep 
                  ? 'h-[45vh] w-[60%] max-w-[320px] mx-auto flex-shrink-0' 
                  : 'h-[50vh] w-[65%] max-w-[280px] flex-shrink-0'
              }`}
            >
              <Image
                src={stepData.image}
                alt={`Miau - Paso ${currentStep + 1}`}
                fill
                className="object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] animate-cat-bounce"
                priority
                unoptimized
              />
            </div>

            {stepData.showLogo && currentStep === 1 && (
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image 
                  src="/assets/MiauBloom-r.svg" 
                  alt="Miau Bloom Logo" 
                  fill 
                  className="object-contain drop-shadow-md" 
                  unoptimized 
                />
              </div>
            )}
          </div>

          {/* Textos */}
          <div 
            ref={textRef}
            className={`px-6 mt-4 ${isLastStep ? 'text-center max-w-md mx-auto' : 'text-left'}`}
          >
            <h1 
              className="text-[32px] font-bold mb-4 leading-tight tracking-tight" 
              style={{ color: THEME_COLOR }}
            >
              {stepData.title}
            </h1>
            <p className="text-gray-700 text-[17px] leading-relaxed font-normal mb-6">
              {stepData.text}
            </p>
          </div>

          {/* Footer */}
          <div className={`w-full flex mt-4 pt-4 ${
            isLastStep 
              ? 'flex-col items-center gap-3' 
              : 'items-center justify-between'
          }`}>
            {!isLastStep && (
              <div className="flex items-center gap-4">
                <PaginationDots current={currentStep} total={totalSteps} />
              </div>
            )}

            <div className={`flex w-full ${
              isLastStep 
                ? 'justify-center gap-3' 
                : 'justify-end max-w-[200px]'
            }`}>
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  style={{ backgroundColor: THEME_COLOR }}
                  className="group w-full px-12 py-4 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none flex items-center justify-center gap-2"
                >
                  <span>{stepData.buttonText}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleRegister} 
                    className="text-white py-3 px-6 rounded-full font-bold text-[16px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    style={{ backgroundColor: THEME_COLOR }}
                  >
                    Inscribirse
                  </button>
                  <button 
                    onClick={handleLogin} 
                    className="text-white py-3 px-6 rounded-full font-bold text-[16px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    style={{ backgroundColor: THEME_COLOR }}
                  >
                    Acceso
                  </button>
                </>
              )}
            </div>
          </div>
        </main>

        <style jsx>{`
          @keyframes cat-bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-16px); }
          }
          
          .animate-cat-bounce {
            animation: cat-bounce 5s ease-in-out infinite;
          }

          @keyframes float-bubble {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>
      </div>

      {/* ============================================
          VERSIÓN DESKTOP - PASOS 2 Y 3
      ============================================ */}
      <div className="hidden lg:flex h-screen bg-white relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-0 w-1/3 h-1/3 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.1 }}></div>
          <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.15 }}></div>
        </div>

        {/* Partículas */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          {dots.map((dot) => (
            <div key={dot.id} style={dot.style}>
              <div className="w-full h-full rounded-full" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.15 }} />
            </div>
          ))}
        </div>

        {/* Botón Anterior */}
        {currentStep > 0 && (
          <button
            onClick={handlePrev}
            className="group absolute top-8 left-8 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-theme-primary)] transition-all duration-300 hover:scale-110 active:scale-95 z-30 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 transition-transform group-hover:-translate-x-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Contenedor principal - Grid de 2 columnas */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-12 py-16 grid grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA: Imagen del gato */}
          <div className="relative h-full flex items-center justify-center">
            <div 
              ref={catRef}
              className="relative w-full h-[550px] flex items-center justify-center"
            >
              <div className="relative w-[450px] h-[450px]">
                <Image
                  src={stepData.image}
                  alt={`Miau - Paso ${currentStep + 1}`}
                  fill
                  className="object-contain drop-shadow-2xl animate-float-slow"
                  priority
                  unoptimized
                />
              </div>
              
              {/* Logo flotante solo en paso 2 */}
              {stepData.showLogo && currentStep === 1 && (
                <div className="absolute bottom-0 right-0 opacity-0 animate-[fadeInRotate_0.8s_ease-out_0.6s_forwards]">
                  <div className="relative w-48 h-48 animate-float-gentle">
                    <Image 
                      src="/assets/MiauBloom-r.svg" 
                      alt="Miau Bloom Logo" 
                      fill 
                      className="object-contain drop-shadow-lg" 
                      unoptimized 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Contenido */}
          <div 
            ref={contentRef}
            className={`flex flex-col justify-center h-full space-y-8 ${
              isLastStep ? 'items-center text-center' : ''
            }`}
          >
            
            {/* Textos */}
            <div className="space-y-6 max-w-xl">
              <h1 
                className={`text-5xl font-bold leading-tight tracking-tight ${
                  isLastStep ? 'text-center' : ''
                }`}
                style={{ color: 'var(--color-theme-primary)' }}
              >
                {stepData.title}
              </h1>
              
              <p className={`text-gray-600 text-xl leading-relaxed ${
                isLastStep ? 'text-center max-w-md mx-auto' : ''
              }`}>
                {stepData.text}
              </p>
            </div>

            {/* Features (solo paso 2) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 gap-4 max-w-xl">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-theme-primary-light)] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--color-theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Reconoce tus emociones</h3>
                    <p className="text-gray-600 text-sm">Aprende a identificar y nombrar lo que sientes</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-theme-primary-light)] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[var(--color-theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Herramientas para crecer</h3>
                    <p className="text-gray-600 text-sm">Accede a actividades personalizadas para ti</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer con paginación y botones */}
            <div className={`flex items-center pt-8 max-w-xl w-full ${
              isLastStep ? 'flex-col gap-6' : 'justify-between'
            }`}>
              {!isLastStep && (
                <PaginationDots current={currentStep} total={totalSteps} />
              )}
              
              <div className={`flex gap-4 ${isLastStep ? 'w-full justify-center' : ''}`}>
                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    className="group px-14 py-5 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
                    style={{ backgroundColor: 'var(--color-theme-primary)' }}
                  >
                    <span>{stepData.buttonText}</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleRegister} 
                      className="group px-12 py-5 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden"
                      style={{ backgroundColor: 'var(--color-theme-primary)' }}
                    >
                      <span className="relative z-10">Inscribirse</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>
                    <button 
                      onClick={handleLogin} 
                      className="group px-12 py-5 rounded-full font-bold text-lg bg-white border-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden"
                      style={{ borderColor: 'var(--color-theme-primary)', color: 'var(--color-theme-primary)' }}
                    >
                      <span className="relative z-10">Acceso</span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: 'var(--color-theme-primary)' }} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }

          @keyframes float-gentle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }

          .animate-float-gentle {
            animation: float-gentle 4s ease-in-out infinite;
          }

          @keyframes fadeInRotate {
            from { opacity: 0; transform: scale(0.5) rotate(-20deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
          }

          @keyframes float-bubble {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>
      </div>
    </>
  );
}