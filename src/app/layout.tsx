/**
 * @file layout.tsx
 * @route src/app/layout.tsx
 * @description Layout raíz de la aplicación MiauBloom.
 * @author Kevin Mariano | Refactor: Gemini
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */

import type { Metadata } from "next";
import { Roboto } from "next/font/google"; 
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiauBloom | Crece y siente", 
  description: "Diseño de herramienta interactiva para apoyo psicoterapéutico y seguimiento de datos emocionales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={roboto.className}> 
      <body className="font-sans text-text-dark"> 
        {children}
      </body>
    </html>
  );
}