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

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiauBloom - Crece y siente",
  description: "Diseño de herramienta interactiva para apoyo psicoterapéutico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${roboto.className}`}>
      {/* El body solo aplica el color de fondo global. */}
      <body className="bg-background-light min-h-screen">
        {children}
      </body>
    </html>
  );
}