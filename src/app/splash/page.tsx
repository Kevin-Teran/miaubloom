/**
 * @file page.tsx
 * @route src/app/splash/page.tsx
 * @description Pantalla de bienvenida (Splash Screen) con animación
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-[#EE7E7F] flex items-center justify-center overflow-hidden">
      {/* Decoración de fondo - Huellas y flores */}
      <div className="absolute inset-0 opacity-30">
        {/* Flores grandes */}
        <div className="absolute top-20 right-16 w-32 h-32 rounded-full bg-[#F5B5B6] blur-sm"></div>
        <div className="absolute bottom-32 left-12 w-40 h-40 rounded-full bg-[#F5B5B6] blur-sm"></div>
        
        {/* Huellas decorativas */}
        <div className="absolute top-40 left-20 transform -rotate-12">
          <div className="flex gap-2">
            <div className="w-4 h-6 bg-[#F5B5B6] rounded-full"></div>
            <div className="w-4 h-6 bg-[#F5B5B6] rounded-full"></div>
          </div>
          <div className="flex gap-3 mt-1 justify-center">
            <div className="w-4 h-6 bg-[#F5B5B6] rounded-full"></div>
            <div className="w-4 h-6 bg-[#F5B5B6] rounded-full"></div>
          </div>
          <div className="w-10 h-8 bg-[#F5B5B6] rounded-t-full mt-1 mx-auto"></div>
        </div>

        {/* Más decoraciones */}
        <div className="absolute bottom-40 right-24 w-20 h-20 rounded-full bg-[#F5B5B6] blur-sm"></div>
        <div className="absolute top-60 right-32 w-16 h-16 rounded-full bg-[#F5B5B6] blur-sm"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        {/* Logo del gatito */}
        <div className="mb-8 animate-bounce-slow">
          <div className="relative w-48 h-48">
            {/* Orejas */}
            <div className="absolute top-0 left-8 w-12 h-16 bg-white rounded-t-full border-4 border-[#8B6F47] transform -rotate-12"></div>
            <div className="absolute top-0 right-8 w-12 h-16 bg-white rounded-t-full border-4 border-[#8B6F47] transform rotate-12"></div>
            <div className="absolute top-2 left-10 w-6 h-10 bg-[#FFB6C1] rounded-t-full"></div>
            <div className="absolute top-2 right-10 w-6 h-10 bg-[#FFB6C1] rounded-t-full"></div>

            {/* Sombrero */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-12 bg-[#D4A574] rounded-full border-4 border-[#8B6F47]"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-[#D4A574] rounded-t-3xl border-4 border-[#8B6F47] border-b-0"></div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-[#8B6F47] rounded-full"></div>

            {/* Cara */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-28 bg-white rounded-3xl border-4 border-[#8B6F47]">
              {/* Ojos */}
              <div className="absolute top-8 left-6 w-8 h-8 bg-[#4A1F1F] rounded-full">
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-8 right-6 w-8 h-8 bg-[#4A1F1F] rounded-full">
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
              </div>

              {/* Nariz */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-[#FFB6C1] rounded-b-full"></div>

              {/* Boca */}
              <div className="absolute top-[4.5rem] left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-2 bg-[#8B6F47]"></div>
                <div className="flex gap-4 mt-[-1px]">
                  <div className="w-6 h-1 bg-[#8B6F47] rounded-full transform rotate-12"></div>
                  <div className="w-6 h-1 bg-[#8B6F47] rounded-full transform -rotate-12"></div>
                </div>
              </div>

              {/* Bigotes */}
              <div className="absolute top-14 left-0 w-8 h-0.5 bg-[#8B6F47] transform -translate-x-6"></div>
              <div className="absolute top-16 left-0 w-8 h-0.5 bg-[#8B6F47] transform -translate-x-6 rotate-12"></div>
              <div className="absolute top-14 right-0 w-8 h-0.5 bg-[#8B6F47] transform translate-x-6"></div>
              <div className="absolute top-16 right-0 w-8 h-0.5 bg-[#8B6F47] transform translate-x-6 -rotate-12"></div>
            </div>

            {/* Cuerpo */}
            <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-white rounded-2xl border-4 border-[#8B6F47]">
              {/* Overol */}
              <div className="absolute inset-0 bg-[#D4A574] rounded-2xl m-1">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-lg"></div>
                <div className="absolute top-3 left-4 w-2 h-2 bg-[#8B6F47] rounded-full"></div>
                <div className="absolute top-3 right-4 w-2 h-2 bg-[#8B6F47] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo texto */}
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-block">
            <h1 className="text-7xl font-bold text-white drop-shadow-lg mb-2">
              <span className="inline-block">Miau</span>
              <br />
              <span className="inline-block text-8xl tracking-wider">Bloom</span>
            </h1>
            {/* Huella en la O */}
            <div className="absolute top-24 right-8 transform translate-x-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-3 bg-[#EE7E7F] rounded-full"></div>
                <div className="w-2 h-3 bg-[#EE7E7F] rounded-full"></div>
              </div>
              <div className="flex gap-1.5 mt-0.5 justify-center">
                <div className="w-2 h-3 bg-[#EE7E7F] rounded-full"></div>
                <div className="w-2 h-3 bg-[#EE7E7F] rounded-full"></div>
              </div>
              <div className="w-5 h-4 bg-[#EE7E7F] rounded-t-full mt-0.5 mx-auto"></div>
            </div>
          </div>
          <p className="text-2xl text-white font-medium mt-4 drop-shadow-md">
            Crece y siente
          </p>
        </div>

        {/* Indicador de carga */}
        <div className="mt-12 flex space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}