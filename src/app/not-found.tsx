/**
 * @file not-found.tsx
 * @route src/app/not-found.tsx
 * @description Página personalizada para errores 404 (No encontrado).
 * @author Kevin Mariano
 * @version 1.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import Link from 'next/link';

const THEME_COLOR = '#F1A8A9';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white p-6 text-center">
      {/* Error 404 */}
      <div className="mb-6">
        <h2 className="text-8xl font-bold" style={{ color: THEME_COLOR }}>
          404
        </h2>
      </div>

      <h1 className="text-3xl font-bold mb-3" style={{ color: THEME_COLOR }}>
        ¡Miau! Página no encontrada
      </h1>
      <p className="text-gray-600 text-base mb-8 max-w-xs">
        No pudimos encontrar la página que buscabas. Quizás se escondió entre las flores.
      </p>

      <Link
        href="/"
        style={{ backgroundColor: THEME_COLOR }}
        className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all select-none inline-block"
      >
        Volver al inicio
      </Link>
    </div>
  );
}