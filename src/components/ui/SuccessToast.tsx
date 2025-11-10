'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { slideFromTop } from '@/lib/animations';

interface SuccessToastProps {
  message: string;
  isOpen: boolean;
}

/**
 * Un componente "Toast" simple para mostrar mensajes de éxito.
 * Aparece en la parte inferior central de la pantalla.
 */
export function SuccessToast({ message, isOpen }: SuccessToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && toastRef.current) {
      slideFromTop(toastRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={toastRef}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg"
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
