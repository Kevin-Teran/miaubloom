/**
 * @file layout.tsx
 * @route src/app/layout.tsx
 * @description Layout raíz de la aplicación MiauBloom.
 * @author Kevin Mariano
 * @version 2.0.0 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { LenisScroll } from '@/components/LenisScroll';
import { AuthProvider } from '@/context/AuthContext';

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

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
      <body className={roboto.className} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <style>{`
          img {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            pointer-events: none !important;
            -webkit-touch-callout: none !important;
          }
        `}</style>
        <AuthProvider>
          <LenisScroll>{children}</LenisScroll>
        </AuthProvider>
      </body>
    </html>
  );
}