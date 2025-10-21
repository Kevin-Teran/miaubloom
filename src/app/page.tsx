"use client";

/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Splash screen de bienvenida animado para MiauBloom
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * @component SplashScreen
 * @description Pantalla de bienvenida con animaciones y redirección automática
 */
export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Redirección después de 3 segundos
    const redirectTimer = setTimeout(() => {
      router.push('/seleccionar-rol');
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-pink-400 via-pink-300 to-coral-400">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-20">
        {/* Flores decorativas */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`flower-${i}`}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
              <circle cx="20" cy="20" r="8" />
              <circle cx="20" cy="8" r="6" />
              <circle cx="32" cy="20" r="6" />
              <circle cx="20" cy="32" r="6" />
              <circle cx="8" cy="20" r="6" />
            </svg>
          </div>
        ))}

        {/* Huellas decorativas */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`paw-${i}`}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
              <ellipse cx="15" cy="18" rx="5" ry="7" />
              <circle cx="10" cy="10" r="3" />
              <circle cx="15" cy="8" r="3" />
              <circle cx="20" cy="10" r="3" />
            </svg>
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo con animación */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative animate-bounce-slow">
            <Image
              src="/assets/logo.png"
              alt="Logo de MiauBloom"
              width={200}
              height={200}
              priority
              className="mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Título con efecto de sombra */}
        <h1
          className="text-white text-6xl font-bold mb-3 animate-slide-up"
          style={{
            textShadow: '3px 3px 6px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5)'
          }}
        >
          MiauBloom
        </h1>

        {/* Subtítulo */}
        <p
          className="text-white text-3xl font-medium mb-8 animate-slide-up"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            animationDelay: '0.2s'
          }}
        >
          Crece y siente
        </p>

        {/* Barra de progreso */}
        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mx-auto backdrop-blur-sm">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Texto de carga */}
        <p className="text-white/90 text-sm mt-4 font-medium animate-pulse">
          Cargando tu experiencia...
        </p>
      </div>

      {/* Estilos de animación personalizados */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </main>
  );
}