'use client'; // 👈 AGREGAR ESTA LÍNEA AL INICIO

import { Toaster as Sonner } from 'sonner';
import { useTheme } from 'next-themes';

// Exportamos el componente Toaster.
// Este componente gestiona la inyección del tema correcto de next-themes
// al componente base <Sonner> para evitar problemas de recursión.
export function Toaster({ ...props }) {
  // Obtenemos el tema actual de next-themes.
  const { theme: nextTheme } = useTheme(); 

  // La librería 'sonner' solo acepta 'light' o 'dark'.
  // Si es 'system', usamos la preferencia resuelta (light o dark).
  const theme = nextTheme === 'system' ? 'light' : nextTheme; 

  return (
    <Sonner 
      theme={theme as 'light' | 'dark'} // Inyectamos el tema seguro
      className="toaster group"
      {...props} 
    />
  );
}