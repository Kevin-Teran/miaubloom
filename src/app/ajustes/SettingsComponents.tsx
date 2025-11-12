"use client";

/**
 * @file SettingsComponents.tsx
 * @route src/app/ajustes/SettingsComponents.tsx
 * @description Componentes compartidos para las páginas de Ajustes (links y toggles).
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useState } from 'react';
import Link from 'next/link';

// Componente reutilizable para items de la lista de ajustes (rosa)
export const SettingsItemLink = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
    <Link href={href} className="flex items-center justify-between py-3 px-4 md:py-5 md:px-4 rounded-lg hover:bg-white/10 transition-colors group md:mb-2 font-roboto md:font-bold md:text-base">
        <span className="text-white text-sm md:text-base md:font-bold">{children}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </Link>
);

// Componente reutilizable para items de la lista de ajustes (blanca)
export const AccountSettingsItemLink = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
    <Link href={href} className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 transition-colors group first:rounded-t-lg">
        <span className="text-gray-800 text-sm">{children}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </Link>
);

// Componente reutilizable para Toggles
export const ToggleItem = ({ label, initialValue = false }: { label: string; initialValue?: boolean; }) => {
    // ESTADO LOCAL TEMPORAL - Necesitarás guardar esto en el backend o localStorage
    const [isEnabled, setIsEnabled] = useState(initialValue);
    const onToggle = () => {
        setIsEnabled(prev => !prev);
        // AQUÍ AÑADIR LÓGICA PARA GUARDAR EL ESTADO
        console.log(`Toggle ${label} changed to: ${!isEnabled}`);
    };

     return (
        <div className="flex items-center justify-between py-3 px-4">
            <span className="text-gray-800 text-sm">{label}</span> {/* Texto más pequeño */}
            <button
                onClick={onToggle}
                // Switch visual básico
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-[var(--color-theme-primary)]' : 'bg-gray-300'}`}
                style={{ outline: `2px solid var(--color-theme-primary)`, outlineOffset: '2px' }}
            >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
};