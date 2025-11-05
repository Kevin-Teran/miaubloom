"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface FormData {
  emocionPrincipal: string;
  nivelAfectacion: number;
  queOcurrio: string;
  quePense: string;
  queHice: string;
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '¿Cómo me sentí?',
      description: 'Selecciona la emoción principal que experimentaste',
      field: 'emocionPrincipal',
    },
    {
      title: '¿Qué tan fuerte fue?',
      description: 'Indica la intensidad de la emoción (1 = poco, 5 = muy fuerte)',
      field: 'nivelAfectacion',
    },
    {
      title: '¿Qué ocurrió?',
      description: 'Describe brevemente el evento que causó esta emoción',
      field: 'queOcurrio',
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

  const handleNext = () => {
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

    // Validaciones
    if (!formData.emocionPrincipal) {
      setError('Por favor selecciona una emoción');
      return;
    }

    if (formData.nivelAfectacion < 1 || formData.nivelAfectacion > 5) {
      setError('El nivel de afectación debe estar entre 1 y 5');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/paciente/registrar-emocion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emocionPrincipal: formData.emocionPrincipal,
          nivelAfectacion: formData.nivelAfectacion,
          queOcurrio: formData.queOcurrio,
          quePense: formData.quePense,
          queHice: formData.queHice,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff]">
        <LoadingIndicator />
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-700 hover:text-[var(--color-theme-primary)] transition-colors"
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
            </button>
            <h1 className="text-lg font-bold text-gray-800">
              Registrar Emoción
            </h1>
            <div className="w-6" />
          </div>

          {/* Indicador de progreso */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  idx <= currentStep
                    ? 'bg-[var(--color-theme-primary)]'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del formulario */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6">
        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Título del paso */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {step.title}
          </h2>
          <p className="text-gray-600">{step.description}</p>
        </div>

        {/* Contenido del paso actual */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          {currentStep === 0 && (
            // Seleccionar emoción
            <div className="grid grid-cols-2 gap-3">
              {EMOCIONES.map(emocion => (
                <button
                  key={emocion.id}
                  type="button"
                  onClick={() => {
                    handleChange('emocionPrincipal', emocion.id);
                    handleNext();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.emocionPrincipal === emocion.id
                      ? 'border-[var(--color-theme-primary)] bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl block mb-2">{emocion.label.split(' ')[0]}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {emocion.label.split(' ').slice(1).join(' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            // Nivel de afectación (slider)
            <div>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.nivelAfectacion}
                onChange={(e) => handleChange('nivelAfectacion', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-theme-primary)]"
              />
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>Poco intenso (1)</span>
                <span className="text-center font-bold text-lg text-[var(--color-theme-primary)]">
                  {formData.nivelAfectacion}
                </span>
                <span>Muy intenso (5)</span>
              </div>
              <div className="mt-6 flex gap-3">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('nivelAfectacion', level)}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all ${
                      formData.nivelAfectacion === level
                        ? 'border-[var(--color-theme-primary)] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-lg">{level}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // ¿Qué ocurrió?
            <textarea
              value={formData.queOcurrio}
              onChange={(e) => handleChange('queOcurrio', e.target.value)}
              placeholder="Describe el evento que causó esta emoción..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)] resize-none h-32"
            />
          )}

          {currentStep === 3 && (
            // ¿Qué pensé?
            <textarea
              value={formData.quePense}
              onChange={(e) => handleChange('quePense', e.target.value)}
              placeholder="Comparte los pensamientos que tuviste en ese momento..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)] resize-none h-32"
            />
          )}

          {currentStep === 4 && (
            // ¿Qué hice?
            <textarea
              value={formData.queHice}
              onChange={(e) => handleChange('queHice', e.target.value)}
              placeholder="Describe cómo actuaste o respondiste..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)] resize-none h-32"
            />
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Atrás
            </button>
          )}

          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-[var(--color-theme-primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Siguiente
            </button>
          )}

          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Emoción'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
