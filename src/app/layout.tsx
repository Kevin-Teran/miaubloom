/**
 * @file layout.tsx
 * @route app/layout.tsx
 * @description Layout principal de la aplicación MiauBloom.
 * Incluye el provider de autenticación, ThemeProvider para tema oscuro/claro, y corrección de metadata PWA.
 * @author Kevin Mariano
 * @version 3.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes'; 

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MiauBloom - Crece y Siente',
  description: 'Herramienta interactiva para apoyo psicoterapéutico y seguimiento de datos emocionales',
  manifest: '/manifest.json',
  themeColor: '#F2C2C1',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MiauBloom',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={roboto.className}>
        {/* Se envuelve con ThemeProvider para habilitar el modo oscuro/claro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}