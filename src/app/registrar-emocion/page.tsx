"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrarEmocionPage() {
  const router = useRouter();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleManualForm = () => {
    router.push('/registrar-emocion/formulario');
  };

  const handleCameraClick = () => {
    console.log('Funcionalidad de cámara - Próximamente');
  };

  const handleGalleryClick = () => {
    console.log('Funcionalidad de galería - Próximamente');
  };

  const options = [
    {
      id: 'camera',
      title: 'Tomar Foto',
      description: 'Captura tu expresión actual',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: handleCameraClick,
      available: false,
    },
    {
      id: 'gallery',
      title: 'Subir Foto',
      description: 'Selecciona de tu galería',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: handleGalleryClick,
      available: false,
    },
    {
      id: 'manual',
      title: 'Formulario',
      description: 'Describe cómo te sientes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: handleManualForm,
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile & Desktop Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-b-[2rem] shadow-sm px-4 py-4 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Registrar Emoción
            </h1>
            
            <div className="w-10 h-10" /> {/* Spacer for balance */}
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-8 lg:px-8 lg:py-12">
          {/* Hero Section */}
          <div className={`text-center mb-8 lg:mb-12 transition-all duration-700 transform ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Emotion Icon with Gradient Background */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F2C2C1] to-[#FFE5E5] rounded-full blur-2xl opacity-40 animate-pulse" />
              <div className="relative bg-white p-6 rounded-full shadow-lg">
                <svg className="w-16 h-16 lg:w-20 lg:h-20 text-[#F2C2C1]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              ¿Cómo te sientes hoy?
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto">
              Elige la forma que prefieras para registrar tu estado emocional
            </p>
          </div>

          {/* Options Grid - Mobile: Stack, Desktop: Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={option.onClick}
                disabled={!option.available}
                className={`
                  group relative bg-white rounded-3xl p-6 lg:p-8
                  transition-all duration-500 transform
                  ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  ${option.available 
                    ? 'hover:scale-105 hover:shadow-xl cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                  shadow-md
                `}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  background: option.available 
                    ? 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)' 
                    : '#FFFFFF'
                }}
              >
                {/* Badge for unavailable options */}
                {!option.available && (
                  <div className="absolute -top-2 -right-2 bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Próximamente
                  </div>
                )}

                {/* Icon Container */}
                <div className={`
                  mb-4 mx-auto w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${option.available 
                    ? 'bg-gradient-to-br from-[#F2C2C1] to-[#FFE5E5] text-white group-hover:from-[#F0A8A7] group-hover:to-[#FFD4D4]' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {option.icon}
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600">
                    {option.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                {option.available && (
                  <>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[#F2C2C1] rounded-full opacity-10 animate-ping" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-[#FFE5E5] rounded-full opacity-20 animate-pulse" />
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className={`
            mt-12 text-center transition-all duration-700 transform
            ${isAnimated ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transitionDelay: '400ms' }}>
            <div className="inline-flex items-center gap-2 bg-[#FFF5F5] px-6 py-3 rounded-full">
              <svg className="w-5 h-5 text-[#F2C2C1]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                Nuevas formas de registro llegarán pronto
              </p>
            </div>
          </div>
        </main>

        {/* Bottom Navigation for Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg px-6 py-4">
          <div className="flex justify-around">
            {['home', 'calendar', 'plus', 'chart', 'user'].map((item) => (
              <button
                key={item}
                className={`p-3 rounded-full transition-all duration-200 ${
                  item === 'plus' 
                    ? 'bg-[#F2C2C1] text-white' 
                    : 'text-gray-400 hover:text-[#F2C2C1]'
                }`}
              >
                {item === 'home' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {item === 'calendar' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {item === 'plus' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {item === 'chart' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                {item === 'user' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}