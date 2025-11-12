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

export const dynamic = 'force-dynamic';

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
    <html lang="es" suppressHydrationWarning>
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
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            // Interceptar setItem para rastrear quién escribe en darkMode
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
              if (key === 'darkMode') {
                console.log('[localStorage] setItem("darkMode", ' + value + ') - llamado desde:', new Error().stack);
              }
              return originalSetItem.apply(this, arguments);
            };
            
            try {
              const darkModeRaw = localStorage.getItem('darkMode');
              console.log('[Layout Script] darkMode from localStorage (raw):', darkModeRaw, 'type:', typeof darkModeRaw);
              
              // Parsear el valor correctamente - puede ser "true", "false", true, false, null
              let isDark = false;
              if (darkModeRaw !== null) {
                try {
                  isDark = JSON.parse(darkModeRaw);
                } catch (e) {
                  isDark = darkModeRaw === 'true';
                }
              }
              
              console.log('[Layout Script] isDark parsed:', isDark);
              
              if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                console.log('[Layout Script] Dark mode ACTIVADO');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
                console.log('[Layout Script] Dark mode DESACTIVADO');
              }
            } catch (e) {
              console.error('[Layout Script] Error:', e);
            }
          })();
        `}} />
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