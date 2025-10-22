"use client";

/**
 * @file page.tsx
 * @route src/app/auth/forgot-password/page.tsx
 * @description Página de recuperación de contraseña (solicitud de código).
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0 // Ajusta la versión inicial si es necesario
 * @copyright MiauBloom
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import Input from '@/components/ui/Input'; // Importa tu componente Input

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Para mostrar errores de API
  const [successMessage, setSuccessMessage] = useState(''); // Para mensajes de éxito

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Limpia errores al escribir
    setSuccessMessage(''); // Limpia mensajes de éxito al escribir
  };

  /**
   * Placeholder para la lógica de enviar el código de recuperación.
   * AQUÍ deberías hacer una llamada a tu API para iniciar el proceso.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validación simple de email (puedes mejorarla)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    console.log('Solicitando código de recuperación para:', email);

    try {
      // --- INICIO: Lógica de ejemplo (Reemplazar con llamada a API real) ---
      // Simula una llamada a tu backend
      // const response = await fetch('/api/auth/request-password-reset', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      // if (!response.ok || !data.success) {
      //   throw new Error(data.message || 'Error al solicitar la recuperación.');
      // }

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Simulación: Código enviado a', email);
      setSuccessMessage('Si el correo está registrado, recibirás un código de verificación.');
      // Opcional: Redirigir a la página de ingreso de código
      // router.push('/auth/reset-password');

      // --- FIN: Lógica de ejemplo ---

    } catch (err) {
      console.error('Error solicitando recuperación:', err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const themeColor = '#F1A8A9'; // Color de acento

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 relative">
      <Link
        // Enlaza de vuelta a la página de login (ajusta la ruta si es necesario)
        // Puedes intentar ir atrás en el historial o a una ruta específica
        href="#"
        onClick={(e) => { e.preventDefault(); router.back(); }} // Opción para volver atrás
        style={{ backgroundColor: themeColor }}
        className="absolute top-8 left-6 flex items-center justify-center w-10 h-10 rounded-full text-white hover:opacity-90 transition-opacity z-10"
        aria-label="Volver"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <main className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Título y Texto */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: themeColor }}>
                Recuperación de contraseña
              </h1>
              <p className="text-gray-600 px-4"> {/* Añadido padding horizontal para que no toque bordes */}
                Ingrese su dirección de correo electrónico para recibir un código de verificación
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mensaje de Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}
               {/* Mensaje de Éxito */}
              {successMessage && !error && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Input Email */}
              <Input
                label="Email Address" // Cambiado a inglés como en la imagen
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="allissonbecker@gmail.com"
                disabled={isLoading || !!successMessage} // Deshabilitado si carga o si ya hay mensaje de éxito
                // Estilos de input tipo píldora
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} //
                labelClassName="text-gray-900 font-semibold mb-1 ml-3" //
              />

              {/* Botón Continuar */}
              <button
                type="submit"
                disabled={isLoading || !!successMessage} // Deshabilitado si carga o si ya hay mensaje de éxito
                style={{ backgroundColor: (isLoading || successMessage) ? '#cccccc' : themeColor }}
                // Botón tipo píldora y menos alto
                className={`w-full text-white py-2 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"> {/* */}
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                 ) : (
                  'Continuar'
                )}
              </button>

            </form>
          </div>
      </main>

       {/* Opcional: Pequeño espacio al final por si acaso */}
       <footer className="h-8"></footer>
    </div>
  );
}