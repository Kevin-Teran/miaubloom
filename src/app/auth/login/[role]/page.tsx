/**
 * @file page.tsx
 * @route src/app/auth/login/[role]/page.tsx
 * @description Página de inicio de sesión con diseño desktop optimizado
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import React, { Suspense, useState } from 'react'; 
import Input from '@/components/ui/Input';
import { EllipseCorner } from '@/components/EllipseCorner';
import IconButton from '@/components/ui/IconButton'; 

/**
 * @component LoginForm
 * @description Formulario de inicio de sesión
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
  const [isLoading, setIsLoading] = useState(false); 
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); 
  const [apiError, setApiError] = useState('');

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
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true); 
    setApiError('');
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                rol: isPatient ? 'Paciente' : 'Psicólogo' 
            }),
        });
        const data = await response.json();
        if (data.success) { 
            const dashboardRoute = isPatient ? '/inicio/paciente' : '/inicio/psicologo';
            const completeProfileRoute = isPatient ? '/auth/complete-profile/paciente' : '/auth/complete-profile/psicologo';
            
            // DETERMINAR LA RUTA DE DESTINO
            const destinationRoute = data.user.perfilCompleto ? dashboardRoute : completeProfileRoute;
            
            // ¡ESTA ES LA CORRECCIÓN!
            // Forzar una recarga completa (hard refresh) en lugar de un router.push()
            // Esto asegura que AuthContext se recargue y lea la nueva cookie de sesión.
            window.location.href = destinationRoute;
            
        } else {
            setApiError(data.message || 'Error al iniciar sesión'); 
        }
    } catch (error) {
        console.error('Error en login:', error);
        setApiError('Error de conexión. Intenta nuevamente.');
    } finally {
        setIsLoading(false); 
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setApiError('');
    console.log('Iniciando proceso de login con Google...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Simulación de Google Sign-In completada (esto es solo un ejemplo).');
    setIsGoogleLoading(false);
  };

  const themeColor = '#F1A8A9';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 relative select-none">
      {/* FRANJA ROSA DECORATIVA */}
      <EllipseCorner />

      {/* ============================================
          COLUMNA IZQUIERDA - SOLO DESKTOP
      ============================================ */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative items-center justify-center p-12">
        <div className="max-w-md space-y-8 select-none">
          {/* Ilustración/Logo */}
          <div className="relative w-64 h-64 mx-auto">
            <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-theme-primary-light)', opacity: 0.2 }}>
              <svg className="w-32 h-32" style={{ color: 'var(--color-theme-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Título y descripción */}
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold" style={{ color: 'var(--color-theme-primary)' }}>
              ¡Te extrañamos!
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Nos alegra verte de nuevo. Continúa tu camino hacia el bienestar emocional.
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--color-theme-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Acceso instantáneo</h3>
                <p className="text-gray-600 text-sm">Vuelve a donde lo dejaste</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--color-theme-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Siempre protegido</h3>
                <p className="text-gray-600 text-sm">Tu información está segura</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--color-theme-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Seguimiento continuo</h3>
                <p className="text-gray-600 text-sm">Tu progreso te espera</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          COLUMNA DERECHA - FORMULARIO
      ============================================ */}
      <div className="flex flex-col flex-1 lg:w-1/2 p-6 lg:p-12 relative">
        {/* --- BOTÓN VOLVER ESTANDARIZADO --- */}
        <IconButton
          icon="back"
          onClick={() => router.back()}
          bgColor={themeColor}
          className="absolute top-6 left-6 lg:top-4 lg:left-4 z-10 shadow-md"
          aria-label="Volver"
        />
        {/* --- FIN BOTÓN VOLVER --- */}

        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-sm lg:max-w-md">
            {/* Header */}
            <div className="text-center mb-10 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" style={{ color: themeColor }}>
                Hola de nuevo
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                bienvenido de nuevo, te hemos extrañado
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <span>{apiError}</span>
                </div>
              )}

              <Input
                label="Correo electrónico" 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange} 
                placeholder="allissonbecker@gmail.com"
                error={errors.email} 
                disabled={isLoading || isGoogleLoading} 
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3 lg:py-3.5`}
                labelClassName="text-gray-900 font-semibold mb-1 ml-3 text-sm lg:text-base"
              />

              <Input
                label="Contraseña" 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleInputChange} 
                placeholder="••••••••"
                error={errors.password} 
                disabled={isLoading || isGoogleLoading} 
                showPasswordToggle={true} 
                className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3 lg:py-3.5`}
                labelClassName="text-gray-900 font-semibold mb-1 ml-3 text-sm lg:text-base"
              />

              <div className="text-center pt-1">
                <Link href="/auth/forgot-password" className="text-sm lg:text-base font-medium text-gray-500 hover:text-pink-600 transition-colors">
                  Recuperación de contraseña
                </Link>
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                style={{ backgroundColor: isLoading ? '#cccccc' : themeColor }}
                className={`w-full text-white py-2 lg:py-3.5 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none cursor-pointer`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>

              {/* Botón Google */}
              <button
                type="button"
                disabled={isLoading || isGoogleLoading} 
                onClick={handleGoogleSignIn}
                className={`w-full bg-white border-none text-gray-800 py-2 lg:py-3.5 rounded-full font-bold text-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none cursor-pointer`}
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M48 24C48 22.04 47.84 20.16 47.52 18.36H24.48V28.56H37.8C37.16 31.88 35.64 34.68 33.04 36.56V43.2H42.12C45.88 39.68 48 34.48 48 28.36V24Z" fill="#4285F4"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M24.48 48.0001C31.2 48.0001 36.88 45.6401 40.12 41.5201L32.56 36.1601C30.2 37.7201 27.56 38.6401 24.48 38.6401C18.64 38.6401 13.68 34.6801 12 29.5201L4.16 34.9601C7.44 41.1601 15.32 48.0001 24.48 48.0001Z" fill="#34A853"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 29.52C11.52 28.08 11.24 26.56 11.24 24.96C11.24 23.36 11.52 21.84 12 20.4L4.16 14.96C1.64 18 0 21.36 0 24.96C0 28.56 1.64 31.92 4.16 34.96L12 29.52Z" fill="#FBBC05"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M24.48 11.28C28.2 11.28 31.44 12.64 34.04 15.04L40.44 8.8C36.88 5.48 31.2 3.36 24.48 3.36C15.32 3.36 7.44 8.76 4.16 14.96L12 20.4C13.68 15.24 18.64 11.28 24.48 11.28Z" fill="#EA4335"/>
                    </svg>
                    Inicia con google
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        {/* Footer Condicional */}
        <footer className="w-full max-w-sm lg:max-w-md mx-auto pb-8 pt-4">
          {isPatient && (
            <div className="text-center">
              <p className="text-sm lg:text-base text-gray-600">
                ¿No Tienes Una Cuenta?{' '}
                <Link
                  href={`/auth/register`} 
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
    </div>
  );
}

const themeColorForFallback = '#F1A8A9';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: themeColorForFallback }}
        ></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}