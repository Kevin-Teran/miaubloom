"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrarEmocionPage() {
  const router = useRouter();

  const handleManualForm = () => {
    router.push('/registrar-emocion/formulario');
  };

  const handleCameraClick = () => {
    console.log('Funcionalidad de cámara - Próximamente');
  };

  const handleGalleryClick = () => {
    console.log('Funcionalidad de galería - Próximamente');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-4">
      {/* Header con botón de cierre */}
      <div className="w-full flex justify-between items-center py-4">
        <h1 className="text-white text-2xl font-bold flex-1 text-center">
          Registrar Emoción
        </h1>
        <button
          onClick={() => router.back()}
          className="p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Contenedor central con instrucciones */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center mb-8">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h2 className="text-white text-xl font-semibold mb-2">
            ¿Cómo deseas registrar tu emoción?
          </h2>
          <p className="text-gray-400 text-sm">
            Selecciona el método que prefieras para capturar tu estado emocional actual
          </p>
        </div>
      </div>

      {/* Opciones de registro */}
      <div className="w-full max-w-sm space-y-3 pb-8">
        {/* Opción: Tomar Foto */}
        <button
          onClick={handleCameraClick}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
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
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Tomar Foto</span>
        </button>

        {/* Opción: Subir de Galería */}
        <button
          onClick={handleGalleryClick}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Subir de Galería</span>
        </button>

        {/* Opción: Formulario Manual */}
        <button
          onClick={handleManualForm}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Formulario Manual</span>
        </button>
      </div>

      {/* Indicador: Beta/Próximamente */}
      <div className="w-full text-center pb-4">
        <p className="text-gray-600 text-xs">
          💡 La cámara y galería estarán disponibles pronto
        </p>
      </div>
    </div>
  );
}
