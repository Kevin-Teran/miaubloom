"use client";

/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Splash screen de bienvenida para MiauBloom. Redirige después de 3 segundos.
 * @author Kevin Mariano
 * @version 1.0.3
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/seleccionar-rol');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 splash-background">
      {/* El div ahora es text-center y el Image usa mx-auto para centrarse */}
      <div className="text-center">
        <Image
          src="/assets/logo.png" /* <-- RUTA ACTUALIZADA */
          alt="Logo de MiauBloom"
          width={250}
          height={250}
          priority
          className="mx-auto" /* <-- CORRECCIÓN DE CENTRADO */
        />
        
        <h1 
          className="text-white text-6xl font-bold mt-4" 
          style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}
        >
          MiauBloom
        </h1>
        <p 
          className="text-white text-2xl mt-2" 
          style={{textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}
        >
          Crece y siente
        </p>
      </div>
    </main>
  );
}