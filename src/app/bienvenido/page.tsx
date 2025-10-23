/**
 * @file page.tsx
 * @route src/app/bienvenido/page.tsx
 * @description Flujo de bienvenida para Pacientes - VERSIÓN FINAL OPTIMIZADA
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  },
];

const THEME_COLOR = '#F4A9A0';

/**
 * @component PaginationDots
 * @description Indicadores de progreso - DISEÑO EXACTO
 */
function PaginationDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`rounded-full transition-all duration-300 ${
            index === current 
              ? 'w-8 h-2.5 bg-[#F4A9A0]'  
              : 'w-2.5 h-2.5 bg-[#FDE6E6]'  
          }`}
        />
      ))}
    </div>
  );
}

/**
 * @component BienvenidoPage
 * @description Página principal del flujo de bienvenida
 */
export default function BienvenidoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState<Dot[]>([]);
  const router = useRouter();

  const stepData = ONBOARDING_STEPS[currentStep];
  const totalSteps = ONBOARDING_STEPS.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    const generatedDots: Dot[] = [];
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 3 + 2;
      generatedDots.push({
        id: i,
        style: {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-bubble ${Math.random() * 12 + 10}s infinite ease-in-out alternate`,
          animationDelay: `${Math.random() * 10}s`,
          zIndex: 0,
        },
      });
    }
    setDots(generatedDots);
  }, []);

  /**
   * Navegación
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleLogin = () => {
    router.push('/auth/login/paciente');
  };

  /**
   * Renderizado del PRIMER PASO (fondo completo)
   * DISEÑO EXACTO según imágenes de referencia
   */
  if (isFirstStep) {
    return (
      <div className="flex flex-col h-screen bg-white relative overflow-hidden">
        
        {/* FONDO: Imagen del jardín 3D */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/jardinero.png"
            alt="Jardín Emocional"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Decoración rosa esquina (solo móvil) */}
        <div className="absolute top-0 right-0 w-1/2 h-1/3 z-0 opacity-40">
          <Image
            src="/assets/ellipse-corner.svg"
            alt=""
            fill
            className="object-contain object-top-right"
            unoptimized
          />
        </div>

        {/* LOGO MIAUBLOOM - Superpuesto en el centro-derecha de la imagen */}
        <div className="absolute top-1/3 right-[10%] transform translate-y-[-50%] z-10 text-right">
          <span className="text-white text-2xl font-bold block drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Miau
          </span>
          <span className="text-white text-6xl font-bold block drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Bloom
          </span>
          <p className="text-white text-sm font-medium mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Crece y siente
          </p>
        </div>

        {/* TARJETA BLANCA INFERIOR - MÁS GRANDE */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[40px] shadow-2xl p-8 pb-10">
          
          {/* Título en rosa */}
          <h1 
            className="text-3xl font-bold text-center mb-4"
            style={{ color: '#F4A9A0' }}
          >
            {stepData.title}
          </h1>
          
          {/* Descripción */}
          <p className="text-gray-700 text-center text-base mb-8 px-2">
            {stepData.text}
          </p>

          {/* FOOTER: Paginación (izquierda) + Botón (derecha) */}
          <div className="flex items-center justify-between">
            {/* Paginación */}
            <PaginationDots current={currentStep} total={totalSteps} />
            
            {/* Botón Comenzar */}
            <button
              onClick={handleNext}
              className="px-10 py-3.5 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl active:scale-95 transition-all"
              style={{ backgroundColor: '#F4A9A0' }}
            >
              {stepData.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renderizado de OTROS PASOS (2 y 3)
   */
   return (
    // Fondo gris claro, layout flex vertical
    <div className="flex flex-col h-screen bg-gray-50 relative overflow-hidden">

      {/* Fondo decorativo (Elipse y Puntos) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* ... (código elipse y puntos sin cambios) ... */}
          <div className="absolute -top-16 -right-16 w-3/4 h-1/2 max-w-sm opacity-60">
             <Image src="/assets/ellipse-corner.svg" alt="" fill className="object-contain object-top-right" unoptimized /> {/* */}
          </div>
          {dots.map((dot) => ( <div key={dot.id} style={dot.style}><Image src="/assets/punto.png" alt="" layout="fill" className="opacity-40" unoptimized/></div> ))} {/* */}
      </div>

      {/* Contenido Principal */}
      <main className="relative z-10 flex flex-col flex-grow h-full justify-between p-6 pt-12 pb-10">

        {/* Sección Superior: Gato + Logo (si aplica) */}
        {/* Usamos flex-grow y justify-center para centrar verticalmente el contenido */}
        <div className="relative w-full flex-grow flex items-center justify-center">

            {/* Contenedor Gato (Controla tamaño y posición) */}
            <div className={`relative h-[45vh] w-[70%] max-w-[280px] ${isLastStep ? 'mx-auto' : 'mr-auto ml-[-5%]'}`}> {/* Centrado en último paso, izq en paso 2 */}
              <Image
                src={stepData.image} // gato-inicio-1 o 2
                alt={`Paso ${currentStep + 1}`}
                fill
                // *** AÑADIDA SOMBRA *** filter drop-shadow(...)
                className="object-contain object-center filter drop-shadow-md" // Centrado, con sombra
                priority={currentStep !== 0}
                unoptimized
              />
            </div>

            {/* Logo MiauBloom (Solo Paso 2) */}
            {stepData.showLogo && !isLastStep && (
              <div className="absolute top-[55%] right-[15%] w-28 h-auto">
                 <Image src="/assets/MiauBloom-r.svg" alt="Miau Bloom Logo" fill className="object-contain" unoptimized /> {/* */}
              </div>
            )}
        </div> {/* Fin Sección Superior */}

        {/* Textos */}
        {/* *** ALINEACIÓN CONDICIONAL *** */}
        <div className={`px-4 mt-4 ${isLastStep ? 'text-center' : 'text-left'}`}> {/* Centrado solo en último paso */}
            <h1 className="text-3xl font-bold mb-3" style={{ color: THEME_COLOR }}>
            {stepData.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
            {stepData.text}
            </p>
        </div>

         {/* Sección Inferior: Paginación y Botones */}
        {/* Usamos mt-auto para empujar hacia abajo */}
        {/* *** LAYOUT CONDICIONAL FOOTER *** */}
        <div className={`w-full flex mt-auto pt-6 ${isLastStep ? 'flex-col items-center gap-6' : 'items-center justify-between'}`}>
             {/* Paginación (Centrada en último paso, Izquierda en otros) */}
             <PaginationDots current={currentStep} total={totalSteps} />

             {/* Botones */}
             <div className={`flex w-full max-w-xs ${isLastStep ? 'gap-4 mt-2' : 'justify-end'}`}> {/* justify-end si no es último, gap y mt si es último */}
                 {!isLastStep ? (
                   // Botón Siguiente (Derecha en paso 2)
                   <button
                     onClick={handleNext}
                     style={{ backgroundColor: THEME_COLOR }}
                     className="px-10 py-3.5 rounded-full font-bold text-base text-white shadow-lg hover:shadow-xl active:scale-95 transition-all select-none"
                   >
                     {stepData.buttonText}
                   </button>
                 ) : (
                   // Botones Inscribirse/Acceso (Centrados en último paso)
                   <>
                     <button onClick={handleRegister} className="flex-1 text-white py-3.5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all select-none" style={{ backgroundColor: THEME_COLOR }}> Inscribirse </button>
                     <button onClick={handleLogin} className="flex-1 text-white py-3.5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all select-none" style={{ backgroundColor: THEME_COLOR }}> Acceso </button>
                   </>
                 )}
             </div>
        </div>
      </main>
    </div>
  );
}