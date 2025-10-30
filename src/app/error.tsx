'use client';

import { useEffect } from 'react';

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
    <div className="flex flex-col min-h-screen items-center justify-center bg-white p-6 text-center">
      <h2 className="text-4xl font-bold mb-4" style={{ color: '#F1A8A9' }}>
        ¡Oops! Algo salió mal
      </h2>
      <p className="text-gray-600 text-base mb-8 max-w-xs">
        Ocurrió un error inesperado. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={() => reset()}
        style={{ backgroundColor: '#F1A8A9' }}
        className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all select-none"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
