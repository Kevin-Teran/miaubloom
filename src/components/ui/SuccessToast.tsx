'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  isOpen: boolean;
}

/**
 * Un componente "Toast" simple para mostrar mensajes de éxito.
 * Aparece en la parte inferior central de la pantalla.
 */
export function SuccessToast({ message, isOpen }: SuccessToastProps) {
  return (
    <div
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
      `}
      style={{ 
        backgroundColor: '#D1FAE5', // verde-100
        color: '#065F46' // verde-800
      }}
    >
      <CheckCircle size={20} className="text-[#10B981]" />
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}
