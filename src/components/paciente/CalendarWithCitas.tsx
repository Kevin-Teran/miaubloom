/**
 * @file CalendarWithCitas.tsx
 * @description Botón de acceso al calendario de citas para pacientes
 * @author Kevin Mariano
 * @version 2.0.0
 * @copyright MiauBloom
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CalendarWithCitasProps {
  themeColor?: string;
  themeColorLight?: string;
  themeColorDark?: string;
}

export function CalendarWithCitas({}: CalendarWithCitasProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/inicio/paciente/calendario')}
      className="flex items-center gap-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl dark:shadow-black/30 px-4 py-3 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 active:scale-95"
    >
      <svg
        className="w-5 h-5 text-[var(--color-theme-primary)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <div className="text-center">
        <span className="block text-2xl font-bold text-[var(--color-theme-primary)] leading-none">
          {new Date().getDate()}
        </span>
        <span className="block text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
          {new Date().toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase()}
        </span>
      </div>
    </button>
  );
}
