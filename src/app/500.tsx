'use client';

import Link from 'next/link';
import { RotateCw, Home } from 'lucide-react';

export default function ErrorPage500() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-red-50 via-red-25 to-white p-6">
      <div className="max-w-md w-full text-center">
        {/* Imagen decorativa */}
        <div className="relative w-56 h-56 mx-auto mb-8">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-8xl font-black text-red-400 opacity-20">500</div>
          </div>
        </div>

        {/* Contenido del error */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl font-black text-red-600 mb-2">
              Error Interno
            </h1>
            <h2 className="text-2xl font-bold text-gray-700">
              Algo salió mal en el servidor
            </h2>
          </div>

          <p className="text-gray-600 text-base leading-relaxed px-4">
            Parece que experimentamos un problema inesperado. Nuestro equipo técnico está siendo notificado y trabajará para solucionarlo lo antes posible.
          </p>

          {/* Opciones de acción */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <RotateCw size={20} />
              Recargar página
            </button>

            <Link
              href="/identificacion"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-gray-700 hover:bg-gray-800 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Home size={20} />
              Ir al inicio
            </Link>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Si el problema persiste, contacta con nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
