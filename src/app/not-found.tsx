"use client";

/**
 * @file not-found.tsx
 * @route src/app/not-found.tsx
 * @description Página personalizada para errores 404 (No encontrado).
 * @author Kevin Mariano
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const THEME_COLOR = 'var(--color-theme-primary)';

interface Dot {
  id: number;
  style: React.CSSProperties;
}

export default function NotFound() {
  const router = useRouter();
  const [dots, setDots] = useState<Dot[]>([]);

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


  const handleRestart = () => {
    router.push('/');
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-6 text-center relative overflow-hidden"
    >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="absolute -top-16 -right-16 w-3/4 h-1/2 max-w-sm opacity-60">
                <Image
                  src="/assets/ellipse-corner.svg"
                  alt=""
                  fill
                  priority 
                  className="object-contain object-top-right"
                  unoptimized />
             </div>
             {/* Renderizar los puntos */}
             {dots.map((dot) => (
               <div key={dot.id} style={dot.style}>
                 <Image
                   src="/assets/punto.png"
                   alt=""
                   fill
                   className="opacity-40"
                   unoptimized/>
               </div>
             ))}
        </div>

        {/* Contenido Principal */}
        <div className="relative z-10 flex flex-col items-center">
            {/* Error 404 */}
            <div className="mb-6 opacity-0 animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
              <h2 className="text-8xl font-bold" style={{ color: THEME_COLOR }}>
                404
              </h2>
            </div>

            {/* Imagen del Gato */}
            <div className="relative w-48 h-48 mb-8">
                 <Image
                    src="/assets/gato-inicio-1.png"
                    alt="Gato confundido"
                    fill
                    priority 
                    className="object-contain filter drop-shadow-md"
                    unoptimized
                 />
            </div>

          <h1 className="text-3xl font-bold mb-3" style={{ color: THEME_COLOR }}>
            ¡Miau! Algo no está aquí
          </h1>
          <p className="text-gray-600 text-base mb-8 max-w-xs">
            No pudimos encontrar la página que buscabas. Quizás se escondió entre las flores.
          </p>

          <button
            onClick={handleRestart}
            style={{ backgroundColor: THEME_COLOR }}
            className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl active:scale-95 transition-all select-none"
          >
            Volver al inicio
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
    </div>
  );
}