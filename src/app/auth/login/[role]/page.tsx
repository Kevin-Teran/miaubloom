"use client";

/**
 * @file page.tsx
 * @route src/app/auth/login/[role]/page.tsx
 * @description Página de inicio de sesión - V11 (Placeholder Google Sign-in, no-select text)
 * @author Kevin Mariano
 * @version 2.11.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';
import Input from '@/components/ui/Input'; //

/**
 * @component LoginForm
 * @description Formulario de inicio de sesión con placeholder para Google y texto no seleccionable
 */
function LoginForm() {
  const params = useParams();
  const router = useRouter();

  const roleParam = params.role;
  const decodedRoleParam = typeof roleParam === 'string' ? decodeURIComponent(roleParam).toLowerCase() : '';
  const role = decodedRoleParam === 'paciente' ? 'paciente'
             : (decodedRoleParam === 'psicologo' || decodedRoleParam === 'psicólogo') ? 'psicologo'
             : 'paciente';
  const isPatient = role === 'paciente';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // Para el login normal
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Estado separado para Google
  const [apiError, setApiError] = useState('');

  // ... (handleInputChange y validateForm sin cambios) ...
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
        newErrors.email = 'El correo electrónico es requerido';
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Ingresa un correo electrónico válido';
        isValid = false;
    }
    if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
        isValid = false;
    } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    // ... (lógica de submit sin cambios) ...
        e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true); // Usa isLoading normal
    setApiError('');
    try {
        const response = await fetch('/api/auth/login', { //
            method: 'POST', //
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                rol: isPatient ? 'Paciente' : 'Psicólogo' //
            }),
        });
        const data = await response.json();
        if (data.success) { //
            const dashboardRoute = isPatient ? '/dashboard/paciente' : '/dashboard/psicologo';
            const completeProfileRoute = isPatient ? '/auth/complete-profile/paciente' : '/auth/complete-profile/psicologo';
            router.push(data.user.perfilCompleto ? dashboardRoute : completeProfileRoute); //
        } else {
            setApiError(data.message || 'Error al iniciar sesión'); //
        }
    } catch (error) {
        console.error('Error en login:', error);
        setApiError('Error de conexión. Intenta nuevamente.');
    } finally {
        setIsLoading(false); // Usa isLoading normal
    }
  };

  /**
   * Placeholder para la lógica de inicio de sesión con Google.
   * AQUÍ deberías integrar tu librería/lógica de autenticación de Google.
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true); // Usa el estado de carga de Google
    setApiError('');
    console.log('Iniciando proceso de login con Google...');
    // --- INICIO: Lógica de ejemplo ---
    // Simula una llamada a API o redirección
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Simulación de Google Sign-In completada (esto es solo un ejemplo).');
    // Aquí normalmente recibirías un token, verificarías en tu backend,
    // crearías/loguearías al usuario y redirigirías.
    // Ejemplo de error simulado:
    // setApiError('Inicio de sesión con Google no implementado.');
    // --- FIN: Lógica de ejemplo ---
    setIsGoogleLoading(false); // Usa el estado de carga de Google
  };

  const themeColor = '#F1A8A9';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 relative">
      <Link
        href="/identificacion" //
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
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: themeColor }}>
                Hola de nuevo
              </h1>
              <p className="text-gray-600">
                bienvenido de nuevo, te hemos extrañado
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && ( /* ... Error API ... */ <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><span>{apiError}</span></div> )}

              <Input
                label="Correo electrónico" //
                type="email" id="email" name="email" value={formData.email}
                onChange={handleInputChange} placeholder="allissonbecker@gmail.com"
                error={errors.email} disabled={isLoading || isGoogleLoading} // Deshabilitado si CUALQUIERA está cargando
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`}
                labelClassName="text-gray-900 font-semibold mb-1 ml-3"
              />

              <Input
                label="Contraseña" //
                type="password" id="password" name="password" value={formData.password}
                onChange={handleInputChange} placeholder="••••••••"
                error={errors.password} disabled={isLoading || isGoogleLoading} // Deshabilitado si CUALQUIERA está cargando
                 showPasswordToggle={true} //
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`}
                labelClassName="text-gray-900 font-semibold mb-1 ml-3"
              />

              <div className="text-center pt-1">
                 <Link href="/auth/forgot-password" className="text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors">
                   Recuperación de contraseña
                 </Link>
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading} // Deshabilitado si CUALQUIERA está cargando
                style={{ backgroundColor: isLoading ? '#cccccc' : themeColor }}
                // *** AÑADIDO select-none ***
                className={`w-full text-white py-1.5 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none`}
              >
                {isLoading ? ( /* ... icono ... */ <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"> {/* */} <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Ingresando...</> )
                : ( 'Ingresar' )}
              </button>

              {/* Botón Google */}
              <button
                 type="button"
                 disabled={isLoading || isGoogleLoading} // Deshabilitado si CUALQUIERA está cargando
                 // *** onClick AÑADIDO ***
                 onClick={handleGoogleSignIn}
                 // *** AÑADIDO select-none ***
                 className={`w-full bg-white border-none text-gray-800 py-1.5 rounded-full font-bold text-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none`}
               >
                 {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24"> {/* */}
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Conectando...
                    </>
                 ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M48 24C48 22.04 47.84 20.16 47.52 18.36H24.48V28.56H37.8C37.16 31.88 35.64 34.68 33.04 36.56V43.2H42.12C45.88 39.68 48 34.48 48 28.36V24Z" fill="#4285F4"/><path fillRule="evenodd" clipRule="evenodd" d="M24.48 48.0001C31.2 48.0001 36.88 45.6401 40.12 41.5201L32.56 36.1601C30.2 37.7201 27.56 38.6401 24.48 38.6401C18.64 38.6401 13.68 34.6801 12 29.5201L4.16 34.9601C7.44 41.1601 15.32 48.0001 24.48 48.0001Z" fill="#34A853"/><path fillRule="evenodd" clipRule="evenodd" d="M12 29.52C11.52 28.08 11.24 26.56 11.24 24.96C11.24 23.36 11.52 21.84 12 20.4L4.16 14.96C1.64 18 0 21.36 0 24.96C0 28.56 1.64 31.92 4.16 34.96L12 29.52Z" fill="#FBBC05"/><path fillRule="evenodd" clipRule="evenodd" d="M24.48 11.28C28.2 11.28 31.44 12.64 34.04 15.04L40.44 8.8C36.88 5.48 31.2 3.36 24.48 3.36C15.32 3.36 7.44 8.76 4.16 14.96L12 20.4C13.68 15.24 18.64 11.28 24.48 11.28Z" fill="#EA4335"/></svg>
                      Inicia con google
                    </>
                 )}
               </button>

            </form>
          </div>
      </main>

      {/* Footer Condicional */}
      <footer className="w-full max-w-sm mx-auto pb-8">
          {/* CONFIRMADO: Solo se muestra si isPatient es true */}
          {isPatient && (
            <div className="text-center">
               <p className="text-sm text-gray-600">
                 ¿No Tienes Una Cuenta?{' '}
                 <Link
                   href={`/auth/register?role=paciente`} //
                   style={{ color: themeColor }}
                   className="font-semibold hover:underline transition-colors"
                 >
                   Crea Tu Cuenta
                 </Link>
               </p>
            </div>
          )}
      </footer>
    </div>
  );
}

// Wrapper LoginPage con Suspense
const themeColorForFallback = '#F1A8A9';

export default function LoginPage() {
 return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2" //
          style={{ borderColor: themeColorForFallback }}
        ></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}