/**
 * @file LenisScroll.tsx
 * @description Componente para activar scroll suave con Lenis en toda la aplicación
 * @author Kevin Mariano
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Hook personalizado para usar Lenis
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

/**
 * @component LenisScroll
 * @description Componente wrapper para activar Lenis en los hijos
 */
export function LenisScroll({ children }: { children: React.ReactNode }) {
  useLenis();

  return <>{children}</>;
}
