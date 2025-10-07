/**
 * @file layout.tsx
 * @route src/app/(auth)/layout.tsx
 * @description Layout raíz de la aplicación (App Router). Define las etiquetas <html> y <body>
 * y carga los estilos globales para toda la PWA.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React from 'react';

/**
 * @file layout.tsx
 * @route src/app/(auth)/layout.tsx
 * @description Layout para todas las rutas de autenticación.
 * Centra el contenido (tarjeta de formulario) en la pantalla.
 */
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex items-center justify-center min-h-screen w-full p-4">
            {children}
        </div>
    );
}