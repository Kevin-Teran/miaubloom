"use client";

/**
 * @file page.tsx
 * @route src/app/auth/login/page.tsx
 * @description Página de inicio de sesión para Pacientes y Psicólogos
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';

/**
 * @component LoginForm
 * @description Formulario de inicio de sesión con validaciones
 */
function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'paciente';
  const isPatient = role === 'paciente';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /**
   * @function handleInputChange
   * @description Maneja los cambios en los inputs del formulario
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setApiError('');
  };

  /**
   * @function validateForm
   * @description Valida los campos del formulario
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
      isValid = false;
    }

    // Validar contraseña
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

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario de login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rol: isPatient ? 'Paciente' : 'Psicólogo'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir según el perfil
        if (data.user.perfilCompleto) {
          // Redirigir al dashboard correspondiente
          const dashboardRoute = isPatient 
            ? '/dashboard/paciente' 
            : '/dashboard/psicologo';
          router.push(dashboardRoute);
        } else {
          // Redirigir a completar perfil
          const completeProfileRoute = isPatient
            ? '/auth/complete-profile/paciente'
            : '/auth/complete-profile/psicologo';
          router.push(completeProfileRoute);
        }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Botón volver */}
      <Link 
        href="/seleccionar-rol" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Volver</span>
      </Link>

      <div className="text-center w-full max-w-sm relative z-10">
        {/* Avatar */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <Image
            src={isPatient ? '/assets/avatar-paciente.png' : '/assets/avatar-psicologo.png'}
            alt={`Avatar ${role}`}
            width={140}
            height={140}
            className="mx-auto relative z-10 drop-shadow-lg"
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-2">
          ¡Hola {isPatient ? 'Paciente' : 'Psicólogo'}!
        </h1>
        <p className="text-gray-500 text-lg">Ingresa tus datos para comenzar</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-8 space-y-5 relative z-10">
        {/* Error general de la API */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        {/* Campo Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="tu@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Campo Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white py-3.5 rounded-full font-bold text-lg bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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

        {/* Enlaces adicionales */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              href={`/auth/register?role=${role}`} 
              className="font-semibold text-pink-500 hover:text-pink-600 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
          <Link
            href="/auth/forgot-password"
            className="block text-sm font-medium text-gray-400 hover:text-pink-500 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
}

/**
 * @component LoginPage
 * @description Wrapper de la página con Suspense
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}