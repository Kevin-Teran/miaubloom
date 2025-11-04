/**
 * @file page.tsx
 * @route src/app/auth/forgot-password/page.tsx
 * @description Página de recuperación de contraseña. Verifica auth, usa API real, redirige al LOGIN DEL ROL tras éxito. Usa LoadingIndicator.
 * @author Kevin Mariano
 * @version 1.0.2 
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { EllipseCorner } from '@/components/EllipseCorner';
import IconButton from '@/components/ui/IconButton';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    console.log('Solicitando código de recuperación para:', email);

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Error al solicitar la recuperación.';
        throw new Error(errorMessage);
      }

      console.log('API Response:', data);
      setSuccessMessage(data.message || 'Si el correo está registrado, recibirás las instrucciones.');

      if (data.rol) {
        const rolePath = data.rol.toLowerCase() === 'psicólogo' ? 'psicologo' : data.rol.toLowerCase();
        const redirectPath = `/auth/login/${rolePath}`; 

        setTimeout(() => {
          //console.log(`Redirigiendo a ${redirectPath} después del éxito...`);
          router.push(redirectPath); 
        }, 2000); 
      } else {
        console.warn("Rol no recibido en la respuesta API, redirigiendo a identificación.");
         setTimeout(() => {
            router.push('/identificacion'); 
         }, 3000);
      }
    } catch (err) {
      console.error('Error solicitando recuperación:', err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const themeColor = '#F1A8A9';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 relative select-none">
      {/* FRANJA ROSA DECORATIVA */}
      <EllipseCorner />

      {/* --- BOTÓN VOLVER ESTANDARIZADO --- */}
      <IconButton
        icon="back"
        onClick={() => router.back()}
        bgColor={themeColor}
        className="absolute top-8 left-6 z-10"
        aria-label="Volver"
      />
      {/* --- FIN BOTÓN VOLVER --- */}

      {/* Contenido Centrado */}
      <main className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Título y Descripción */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: themeColor }}>
                Recuperación de contraseña
              </h1>
              <p className="text-gray-600 px-4">
                Ingresa tu dirección de correo electrónico para recibir las instrucciones.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mensaje de Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex flex-col items-center gap-1 text-center">
                  <span>{error.split('¿Deseas')[0]}</span>
                  {error.includes('¿Deseas crear una cuenta?') && ( 
                    <Link href="/auth/register"
                      className="font-semibold underline text-red-800 hover:text-red-900 mt-1 cursor-pointer">
                      Crear una cuenta
                    </Link>
                  )}
                </div>
              )}

              {/* Mensaje de Éxito */}
              {successMessage && !error && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Input Email */}
              <Input
                label="Email"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="tu.correo@ejemplo.com"
                disabled={isLoading || !!successMessage}
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`}
                labelClassName="text-gray-900 font-semibold mb-1 ml-3"
              />

    			   {/* Botón Enviar Instrucciones */}
              <button
                type="submit"
                disabled={isLoading || !!successMessage}
                style={{ backgroundColor: (isLoading || successMessage) ? '#cccccc' : themeColor }}
                className={`w-full text-white py-2 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none ${!(isLoading || !!successMessage) ? 'cursor-pointer' : ''}`}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
      </main>

    <footer className="h-8"></footer>
    </div>
  );
}