'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Imagen del gato - más compacta */}
        <div className="relative w-48 h-48 mx-auto mb-2 -mt-20">
          <Image
            src="/assets/cat_404.png"
            alt="Gato perdido 404"
            width={192}
            height={192}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Texto del error */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-800">
            ¡Página no encontrada!
          </h2>
          <p className="text-gray-600 text-base leading-relaxed px-4">
            Parece que esta página se perdió como un gato curioso. 
            No te preocupes, te ayudaremos a encontrar el camino.
          </p>
        </div>

        {/* Botón de acción */}
        <Link
          href="/"
          style={{ backgroundColor: '#F1A8A9' }}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 select-none"
        >
          <Home size={20} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}