import React from 'react';

/**
 * @file layout.tsx
 * @route src/app/(main)/layout.tsx
 * @description Layout para todas las rutas de la aplicación principal (post-login).
 * Incluiría componentes como el Header, Sidebar de navegación y Footer.
 */
export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background-light text-text-dark">
            
            {/* 1. Header Fijo (Simulación del Encabezado con logo y notificaciones) */}
            <header className="sticky top-0 z-10 p-4 border-b border-text-light/30 bg-white shadow-sm">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-primary">Miau Bloom</h1>
                    {/* Placeholder para Avatar de perfil y Botón de ajustes/notificaciones */}
                    <div className="space-x-4">
                        [cite_start]<span className='text-body-1'>Notificaciones [cite: 624]</span>
                        [cite_start]<span className='text-body-1'>Perfil [cite: 554]</span>
                    </div>
                </div>
            </header>

            {/* 2. Contenido Principal con Margen de 16px (como indica el Diseño - Pág. 20 del PDF) */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Opcional: Footer o Barra de Navegación Inferior para móvil */}
        </div>
    );
}