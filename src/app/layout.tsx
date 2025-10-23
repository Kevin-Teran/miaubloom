/**
 * @file layout.tsx
 * @route src/app/layout.tsx
 * @description Layout raíz de la aplicación MiauBloom.
 * @author Kevin Mariano
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MiauBloom',
  description: 'MiauBloom - Crece y siente',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#EE7E7F" />
        <link rel="manifest" href="/manifest.json" />

        {/* Favicon estándar apuntando al icono de 192x192 */}
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />

        {/* Icono para Apple (iOS) apuntando al de 512x512 */}
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />

        {/* PWA capability tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" /> 
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MiauBloom" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}