/**
 * @file layout.tsx
 * @route src/app/layout.tsx
 * @description Layout raíz de la aplicación (App Router). Define las etiquetas <html> y <body>
 * y carga los estilos globales para toda la PWA.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import type { Metadata } from 'next';
import './globals.css'; // Importa los estilos globales (Tailwind)

/**
 * @constant metadata
 * @description Define los metadatos de la aplicación para el SEO y manifest de la PWA.
 */
export const metadata: Metadata = {
    title: 'MiauBloom | Crece y siente',
    description: 'Herramienta interactiva para apoyo psicoterapéutico y seguimiento emocional.',
    // Configuración básica para PWA
    manifest: '/manifest.json',
    icons: [
        { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
        { rel: 'icon', url: '/favicon.ico' },
    ]
};

/**
 * @function RootLayout
 * @description Componente de layout principal que envuelve todas las páginas.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido de la página actual.
 * @returns {JSX.Element} La estructura HTML principal.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                {children}
            </body>
        </html>
    );
}
