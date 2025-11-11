"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { pageTransition, shakeError } from '@/lib/animations';

interface FormData {
  emocionPrincipal: string;
  nivelAfectacion: number;
  queOcurrio: string;
  quePense: string;
  queHice: string;
  lugar: string;
}

const EMOCIONES = [
  { id: 'alegria', label: '😊 Alegría', color: '#FFD700' },
  { id: 'tristeza', label: '😢 Tristeza', color: '#87CEEB' },
  { id: 'ansiedad', label: '😰 Ansiedad', color: '#FF6347' },
  { id: 'calma', label: '😌 Calma', color: '#90EE90' },
  { id: 'frustacion', label: '😤 Frustración', color: '#FF8C00' },
  { id: 'amor', label: '❤️ Amor', color: '#FF69B4' },
];

export default function FormularioEmocionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    emocionPrincipal: '',
    nivelAfectacion: 3,
    queOcurrio: '',
    quePense: '',
    queHice: '',
    lugar: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  const pageRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Animación de entrada
  useEffect(() => {
    if (pageRef.current) {
      pageTransition(pageRef.current, 0.1);
    }
  }, []);

  // Animación de error
  useEffect(() => {
    if (stepErrors[currentStep] && errorRef.current) {
      shakeError(errorRef.current);
    }
  }, [stepErrors, currentStep]);

  const steps = [
    {
      title: '¿Cómo me sentí?',
      description: 'Selecciona la emoción principal que experimentaste',
      field: 'emocionPrincipal',
    },
    {
      title: '¿Qué tan fuerte fue?',
      description: 'Indica la intensidad de la emoción',
      field: 'nivelAfectacion',
    },
    {
      title: '¿Qué ocurrió?',
      description: 'Describe brevemente el evento que causó esta emoción',
      field: 'queOcurrio',
    },
    {
      title: '¿En dónde estabas?',
      description: 'Indica el lugar donde te sentiste así',
      field: 'lugar',
    },
    {
      title: '¿Qué pensé?',
      description: 'Comparte los pensamientos que tuviste en ese momento',
      field: 'quePense',
    },
    {
      title: '¿Qué hice?',
      description: 'Describe cómo actuaste o respondiste',
      field: 'queHice',
    },
  ];

  const handleChange = (
    field: keyof FormData,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCurrentStep = (): boolean => {
    const currentField = steps[currentStep].field as keyof FormData;
    const value = formData[currentField];
    
    // Validar según el campo
    if (currentField === 'emocionPrincipal' && !value) {
      setStepErrors({ ...stepErrors, [currentStep]: 'Por favor selecciona una emoción' });
      return false;
    }
    
    if (currentField === 'nivelAfectacion' && value === 0) {
      setStepErrors({ ...stepErrors, [currentStep]: 'Por favor selecciona el nivel de afectación' });
      return false;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      const fieldNames: Record<string, string> = {
        queOcurrio: 'Por favor describe qué ocurrió',
        lugar: 'Por favor indica dónde estabas',
        quePense: 'Por favor comparte qué pensaste',
        queHice: 'Por favor describe qué hiciste',
      };
      setStepErrors({ ...stepErrors, [currentStep]: fieldNames[currentField] || 'Este campo es obligatorio' });
      return false;
    }
    
    // Limpiar error si está válido
    const newErrors = { ...stepErrors };
    delete newErrors[currentStep];
    setStepErrors(newErrors);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validar el paso actual antes de enviar
    if (!validateCurrentStep()) {
      return;
    }

    // Validaciones generales
    if (!formData.emocionPrincipal) {
      setError('Por favor selecciona una emoción');
      setStepErrors({ ...stepErrors, 0: 'Por favor selecciona una emoción' });
      setCurrentStep(0);
      return;
    }

    if (formData.nivelAfectacion < 1 || formData.nivelAfectacion > 5) {
      setError('El nivel de afectación debe estar entre 1 y 5');
      setStepErrors({ ...stepErrors, 1: 'El nivel de afectación debe estar entre 1 y 5' });
      setCurrentStep(1);
      return;
    }
    
    // Validar campos de texto obligatorios
    if (!formData.queOcurrio.trim()) {
      setError('Por favor describe qué ocurrió');
      setStepErrors({ ...stepErrors, 2: 'Por favor describe qué ocurrió' });
      setCurrentStep(2);
      return;
    }
    
    if (!formData.lugar.trim()) {
      setError('Por favor indica en dónde estabas');
      setStepErrors({ ...stepErrors, 3: 'Por favor indica en dónde estabas' });
      setCurrentStep(3);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/paciente/registrar-emocion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emocionPrincipal: formData.emocionPrincipal,
          nivelAfectacion: formData.nivelAfectacion,
          queOcurrio: formData.queOcurrio,
          quePense: formData.quePense,
          queHice: formData.queHice,
          lugar: formData.lugar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la emoción');
      }

      const data = await response.json();
      console.log('Emoción registrada:', data);
      setSuccessMessage('¡Emoción registrada exitosamente!');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push('/inicio/paciente');
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al registrar la emoción'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingIndicator />
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50">
      {/* Header - Desktop y Mobile */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#070806] hover:text-[var(--color-theme-primary)] transition-colors"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
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
              <span className="hidden md:inline-block text-base font-medium">Volver</span>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-[#070806]">
              Registrar Emoción
            </h1>
            <div className="w-6 md:w-20" />
          </div>
        </div>
      </div>

      {/* Indicador de progreso - Mejorado */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-3">
            {steps.map((s, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 ${
                      idx < currentStep
                        ? 'bg-[var(--color-theme-primary)] text-white'
                        : idx === currentStep
                        ? 'bg-[var(--color-theme-primary)] text-white ring-4 ring-[var(--color-theme-primary)]/20'
                        : 'bg-gray-200 text-[#B6BABE]'
                    }`}
                  >
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs md:text-sm font-medium text-center hidden md:block ${
                    idx <= currentStep ? 'text-[#070806]' : 'text-[#B6BABE]'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      idx < currentStep
                        ? 'bg-[var(--color-theme-primary)]'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del formulario */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm md:text-base font-medium">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm md:text-base font-medium">{successMessage}</p>
          </div>
        )}

        {/* Título del paso - Mejorado */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#070806] mb-3">
            {step.title}
          </h2>
          <p className="text-base md:text-lg text-[#B6BABE] font-medium">
            {step.description}
          </p>
        </div>

        {/* Contenido del paso actual - Card mejorada */}
        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-lg shadow-gray-200/50 p-6 md:p-10 mb-8 transition-all duration-300">
          {currentStep === 0 && (
            // Seleccionar emoción - Mejorado
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {EMOCIONES.map(emocion => (
                <button
                  key={emocion.id}
                  type="button"
                  onClick={() => {
                    handleChange('emocionPrincipal', emocion.id);
                    setTimeout(() => handleNext(), 300);
                  }}
                  className={`p-5 md:p-8 rounded-[28px] border-3 transition-all duration-200 hover:scale-105 ${
                    formData.emocionPrincipal === emocion.id
                      ? 'border-[var(--color-theme-primary)] bg-[var(--color-theme-primary)]/5 shadow-lg shadow-[var(--color-theme-primary)]/20'
                      : 'border-gray-200 hover:border-[var(--color-theme-primary)]/30 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-4xl md:text-5xl block mb-3 md:mb-4">
                    {emocion.label.split(' ')[0]}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-[#070806]">
                    {emocion.label.split(' ').slice(1).join(' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            // Nivel de afectación - Mejorado
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8 md:mb-12">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.nivelAfectacion}
                  onChange={(e) => handleChange('nivelAfectacion', parseInt(e.target.value))}
                  className="w-full h-3 md:h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[var(--color-theme-primary)] slider-thumb"
                  style={{
                    background: `linear-gradient(to right, var(--color-theme-primary) 0%, var(--color-theme-primary) ${
                      ((formData.nivelAfectacion - 1) / 4) * 100
                    }%, #e5e7eb ${((formData.nivelAfectacion - 1) / 4) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="bg-[var(--color-theme-primary)] text-white text-4xl md:text-5xl font-bold rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg">
                  {formData.nivelAfectacion}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('nivelAfectacion', level)}
                    className={`py-4 md:py-6 px-2 rounded-[20px] border-3 transition-all duration-200 hover:scale-105 ${
                      formData.nivelAfectacion === level
                        ? 'border-[var(--color-theme-primary)] bg-[var(--color-theme-primary)]/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold text-xl md:text-2xl text-[#070806]">{level}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6 text-sm md:text-base text-[#B6BABE] font-medium px-2">
                <span>Poco intenso</span>
                <span>Muy intenso</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // ¿Qué ocurrió? - Mejorado
            <div className="max-w-2xl mx-auto">
              <textarea
                value={formData.queOcurrio}
                onChange={(e) => handleChange('queOcurrio', e.target.value)}
                placeholder="Escribe aquí lo que sucedió..."
                className="w-full p-5 md:p-6 border-2 border-gray-200 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 focus:border-[var(--color-theme-primary)] resize-none h-48 md:h-64 text-base md:text-lg text-[#070806] placeholder:text-[#B6BABE] transition-all"
              />
            </div>
          )}

          {currentStep === 3 && (
            // ¿En dónde estabas? - Nuevo
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={formData.lugar}
                onChange={(e) => handleChange('lugar', e.target.value)}
                placeholder="Ej: En casa, En el trabajo, En la escuela, En la calle..."
                className="w-full p-5 md:p-6 border-2 border-gray-200 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 focus:border-[var(--color-theme-primary)] text-base md:text-lg text-[#070806] placeholder:text-[#B6BABE] transition-all"
              />
            </div>
          )}

          {currentStep === 4 && (
            // ¿Qué pensé? - Mejorado
            <div className="max-w-2xl mx-auto">
              <textarea
                value={formData.quePense}
                onChange={(e) => handleChange('quePense', e.target.value)}
                placeholder="Escribe tus pensamientos..."
                className="w-full p-5 md:p-6 border-2 border-gray-200 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 focus:border-[var(--color-theme-primary)] resize-none h-48 md:h-64 text-base md:text-lg text-[#070806] placeholder:text-[#B6BABE] transition-all"
              />
            </div>
          )}

          {currentStep === 5 && (
            // ¿Qué hice? - Mejorado
            <div className="max-w-2xl mx-auto">
              <textarea
                value={formData.queHice}
                onChange={(e) => handleChange('queHice', e.target.value)}
                placeholder="Describe cómo actuaste..."
                className="w-full p-5 md:p-6 border-2 border-gray-200 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-[var(--color-theme-primary)]/20 focus:border-[var(--color-theme-primary)] resize-none h-48 md:h-64 text-base md:text-lg text-[#070806] placeholder:text-[#B6BABE] transition-all"
              />
            </div>
          )}
        </div>

        {/* Mensaje de error del paso actual */}
        {stepErrors[currentStep] && (
          <div ref={errorRef} className="max-w-2xl mx-auto mb-4">
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{stepErrors[currentStep]}</span>
            </div>
          </div>
        )}

        {/* Botones de navegación - Mejorados */}
        <div className="flex gap-4 max-w-2xl mx-auto">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 px-6 py-4 md:py-5 border-3 border-gray-300 text-[#070806] font-bold text-base md:text-lg rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:scale-105"
            >
              Atrás
            </button>
          )}

          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-6 py-4 md:py-5 bg-[var(--color-theme-primary)] text-white font-bold text-base md:text-lg rounded-full hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg shadow-[var(--color-theme-primary)]/30"
            >
              Siguiente
            </button>
          )}

          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 md:py-5 bg-green-500 text-white font-bold text-base md:text-lg rounded-full hover:bg-green-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
            >
              {isLoading ? 'Guardando...' : 'Guardar Emoción'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}