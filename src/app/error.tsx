'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { RotateCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-red-50 to-white p-6">
      <div className="max-w-md w-full text-center">
        {/* Imagen del gato - más compacta */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image
            src="/assets/cat-500.png"
            alt="Gato reparando servidor"
            width={192}
            height={192}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Texto del error */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl font-black" style={{ color: '#FFFF' }}>
            500
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            ¡Oops! Algo salió mal
          </h2>
          <p className="text-gray-600 text-base leading-relaxed px-4">
            Ocurrió un error inesperado en el servidor. 
            Por favor, intenta de nuevo.
          </p>
        </div>

        {/* Botón de acción */}
        <button
          onClick={() => reset()}
          style={{ backgroundColor: 'var(--color-theme-primary)' }}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 select-none"
        >
          <RotateCw size={20} />
          Intentar de nuevo
        </button>

        {/* Detalle técnico (opcional) */}
        {error.digest && (
          <p className="text-xs text-gray-400 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
