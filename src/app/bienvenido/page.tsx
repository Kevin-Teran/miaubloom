/**
 * @file page.tsx
 * @route src/app/bienvenido/page.tsx
 * @description Flujo de bienvenida para Pacientes - VERSIÓN MEJORADA CON GSAP
 * @author Kevin Mariano
 * @version 3.0.0
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

const THEME_COLOR = '#F4A9A0';

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
              ? 'w-10 h-2.5 bg-[#F4A9A0] shadow-md'  
              : 'w-2.5 h-2.5 bg-[#FDE6E6] hover:bg-[#FCC5C0] cursor-pointer'  
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
  const [isAnimating, setIsAnimating] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const stepData = ONBOARDING_STEPS[currentStep];
  const totalSteps = ONBOARDING_STEPS.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Generar puntos decorativos
  useEffect(() => {
    const generatedDots: Dot[] = [];
    for (let i = 0; i < 12; i++) {
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
      gsap.set(catRef.current, {
        opacity: 0,
      });

      gsap.to(catRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.inOut',
        delay: 0.2,
      });
    }

    if (textRef.current && !isFirstStep) {
      gsap.set(textRef.current, {
        opacity: 0,
      });

      gsap.to(textRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.inOut',
        delay: 0.3,
      });
    }
  }, [currentStep, isFirstStep]);

  /**
   * Navegación con animación mejorada
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 0);
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
   * Composición mejorada con mejor jerarquía visual
   */
  if (isFirstStep) {
    return (
      <div className={`flex flex-col h-screen bg-white relative overflow-hidden transition-opacity duration-0 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}>
        
        {/* FRANJA ROSA DECORATIVA */}
        <EllipseCorner />

        {/* FONDO: Color blanco rosado */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-pink-50 to-white"></div>

        {/* FONDO: Imagen del jardín 3D */}
        <div className="absolute inset-0 z-1 flex items-start justify-center md:justify-start -mt-32 md:-mt-40">
          <Image
            src="/assets/jardinero.png"
            alt="Jardín Emocional"
            fill
            className="object-contain md:object-contain brightness-95 scale-125 md:scale-100 md:object-left"
            priority
            unoptimized
          />
          {/* Overlay sutil para mejor contraste */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
        </div>

        {/* Decoración rosa esquina mejorada */}
        <div className="hidden absolute top-0 right-0 w-1/2 h-1/3 z-0 opacity-30">
          <Image
            src="/assets/ellipse-corner.svg"
            alt=""
            fill
            className="object-contain object-top-right"
            unoptimized
          />
        </div>

        {/* LOGO MIAUBLOOM - Posicionamiento encima de la imagen */}
        <div className="absolute top-1/2 md:top-1/2 left-1/4 md:left-1/3 transform -translate-y-1/2 -translate-x-8 md:-translate-x-12 z-20 text-center opacity-0 animate-[fadeIn_1s_ease-in-out_0.5s_forwards]">
          <div className="relative w-48 md:w-64 h-48 md:h-64 drop-shadow-2xl">
            <Image 
              src="/assets/MiauBloom-b.svg" 
              alt="Miau Bloom Logo" 
              fill 
              className="object-contain drop-shadow-2xl filter" 
              unoptimized 
            />
          </div>
        </div>

        {/* TARJETA BLANCA INFERIOR - Composición optimizada */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[45px] shadow-2xl p-8 pb-12 animate-slide-up">
          
          {/* Indicador visual superior */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 opacity-40" />
          
          {/* Título con mejor tipografía */}
          <h1 
            className="text-[32px] font-bold text-center mb-5 leading-tight tracking-tight"
            style={{ color: '#F4A9A0' }}
          >
            {stepData.title}
          </h1>
          
          {/* Descripción con mejor espaciado */}
          <p className="text-gray-600 text-center text-[17px] leading-relaxed mb-10 px-4 max-w-md mx-auto">
            {stepData.text}
          </p>

          {/* FOOTER: Paginación + Botones con mejor distribución */}
          <div className="flex items-center justify-between px-2 gap-4 w-full">
            {/* Paginación */}
            <div className="flex-1">
              <PaginationDots current={currentStep} total={totalSteps} />
            </div>
            
            {/* Botón Comenzar con mejor diseño */}
            <button
              onClick={handleNext}
              className="px-12 py-4 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none whitespace-nowrap"
              style={{ backgroundColor: '#F4A9A0' }}
            >
              {stepData.buttonText}
            </button>
          </div>
        </div>

        {/* Estilos de animación */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-20px) translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) translateX(0);
            }
          }
          
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  /**
   * PASOS 2 Y 3: Composición mejorada con mejor balance visual
   */
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden transition-opacity duration-0">

      {/* FRANJA ROSA DECORATIVA */}
      <EllipseCorner />

      {/* Fondo decorativo mejorado */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Partículas pequeñas rosas flotantes */}
        {dots.map((dot) => (
          <div key={dot.id} style={dot.style}>
            <div className="w-full h-full rounded-full" style={{ backgroundColor: '#F4A9A0', opacity: 0.3 }} />
          </div>
        ))}
      </div>

      {/* Contenido Principal con mejor estructura */}
      <main className={`relative z-10 flex flex-col h-full justify-between p-6 pt-16 pb-10`}>

        {/* Botón Anterior en esquina superior izquierda */}
        {currentStep > 0 && (
          <button
            onClick={handlePrev}
            className="group absolute top-6 left-6 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
            style={{ borderColor: THEME_COLOR }}
            title="Anterior"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" style={{ backgroundColor: THEME_COLOR }} />
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5 relative z-10" style={{ color: THEME_COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Sección Superior: Gato + Logo */}
        <div className="relative w-full flex-grow flex items-center justify-center gap-8 px-6 md:px-12">

          {/* Contenedor del Gato con mejor composición y animación GSAP */}
          <div 
            ref={catRef}
            className={`relative transition-all duration-500 transform ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            } ${
              isLastStep 
                ? 'h-[45vh] w-[60%] max-w-[320px] mx-auto flex-shrink-0' 
                : 'h-[50vh] w-[65%] max-w-[280px] flex-shrink-0'
            }`}
          >
            <Image
              src={stepData.image}
              alt={`Miau - Paso ${currentStep + 1}`}
              fill
              className="object-contain object-center filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:drop-shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-500 animate-cat-bounce"
              priority={currentStep !== 0}
              unoptimized
            />
          </div>

          {/* Logo MiauBloom al lado del gato (Solo Paso 2 - Soy Miau) */}
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

        {/* Contenedor de Textos con mejor tipografía y animación GSAP */}
        <div 
          ref={textRef}
          className={`px-6 md:px-12 mt-4 transition-all duration-500 transform ${
            isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          } ${isLastStep ? 'text-center max-w-md mx-auto' : 'text-left'}`}>
          <h1 
            className="text-[32px] font-bold mb-4 leading-tight tracking-tight text-gray-900" 
            style={{ color: THEME_COLOR }}
          >
            {stepData.title}
          </h1>
          <p className="text-gray-700 text-[17px] leading-relaxed font-normal mb-6">
            {stepData.text}
          </p>
        </div>

        {/* Footer con mejor distribución y botones de navegación */}
        <div className={`w-full flex mt-4 pt-4 transition-all duration-500 transform ${
          isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        } ${
          isLastStep 
            ? 'flex-col items-center gap-3 justify-end' 
            : 'items-center justify-between'
        }`}>
          {/* Sección izquierda: Paginación */}
          {!isLastStep && (
            <div className="flex items-center gap-4">
              {/* Paginación */}
              <PaginationDots current={currentStep} total={totalSteps} />
            </div>
          )}

          {/* Sección derecha: Botones de acción */}
          <div className={`flex w-full ${
            isLastStep 
              ? 'justify-center gap-3' 
              : 'justify-end max-w-[200px]'
          }`}>
            {!isLastStep ? (
              // Botón Siguiente con efecto mejorado
              <button
                onClick={handleNext}
                style={{ backgroundColor: THEME_COLOR }}
                className="group w-full px-12 py-4 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">{stepData.buttonText}</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
              </button>
            ) : (
              <>
                <button 
                  onClick={handleRegister} 
                  className="group text-white py-3 px-6 rounded-full font-bold text-[16px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none relative overflow-hidden"
                  style={{ backgroundColor: THEME_COLOR }}
                >
                  <span className="relative z-10">Inscribirse</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
                </button>
                <button 
                  onClick={handleLogin} 
                  className="group text-white py-3 px-6 rounded-full font-bold text-[16px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 select-none relative overflow-hidden"
                  style={{ backgroundColor: THEME_COLOR }}
                >
                  <span className="relative z-10">Acceso</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Animaciones adicionales */}
      <style jsx>{`
        @keyframes fade-in-logo {
          from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        .animate-fade-in-logo {
          animation: fade-in-logo 0.6s ease-out 0.3s both;
        }

        @keyframes logo-float {
          0%, 100% {
            transform: translateY(0px) rotateZ(0deg);
          }
          50% {
            transform: translateY(-12px) rotateZ(2deg);
          }
        }
        
        .animate-logo-float {
          animation: logo-float 4s ease-in-out infinite;
        }

        @keyframes cat-bounce {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
          }
          25% {
            transform: translateY(-8px) scaleY(0.95);
          }
          50% {
            transform: translateY(-16px) scaleY(1);
          }
          75% {
            transform: translateY(-8px) scaleY(0.95);
          }
        }
        
        .animate-cat-bounce {
          animation: cat-bounce 5s ease-in-out infinite;
        }
        
        @keyframes float-bubble {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}