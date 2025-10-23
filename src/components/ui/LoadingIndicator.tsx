/**
 * @file LoadingIndicator.tsx
 * @route src/components/ui/LoadingIndicator.tsx
 * @description Muestra una barra de carga animada y un texto opcional, adaptada para fondos claros.
 * @author Kevin Mariano
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React from 'react';

interface LoadingIndicatorProps {
  text?: string;
  className?: string; 
  barColor?: string;
  trackColor?: string;
  textColor?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = "Cargando tu experiencia...",
  className = '',
  barColor = 'var(--color-primary)',
  trackColor = 'var(--color-primary-light)',
  textColor = 'text-gray-600',
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Barra animada */}
      {/* Usamos style para aplicar los colores dinámicos */}
      <div
        className="w-40 h-1.5 rounded-full overflow-hidden mx-auto relative opacity-30" 
        style={{ backgroundColor: trackColor }} 
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full animate-loading-bar opacity-100" 
          style={{
            backgroundColor: barColor,
            width: '100%' 
          }}
        />
      </div>
      {/* Texto */}
      <p className={`text-xs mt-2 font-light ${textColor}`}>
        {text}
      </p>
      {/* Estilo para la animación de la barra (sin cambios) */}
      <style jsx global>{`
        @keyframes loading-bar-animation {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar-animation 1.5s ease-in-out infinite;
          transform-origin: left center;
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;