/**
 * @file Login.tsx
 * @route src/components/auth/Login.tsx
 * @description Componente de inicio de sesión completamente funcional con validación
 * y manejo de errores robusto.
 * @author Kevin Mariano
 * @version 2.0.0
 * @copyright MiauBloom
 */

"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  defaultRole: 'Paciente' | 'Psicólogo';
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login({ defaultRole }: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de contraseña
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrors({});
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          expectedRole: defaultRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Error al iniciar sesión' });
        return;
      }

      // Guardar datos de sesión
      const { sessionData } = data;
      localStorage.setItem('miaubloom_session', JSON.stringify(sessionData));

      // Redirigir según el estado del perfil
      if (!sessionData.isProfileComplete) {
        router.push(`/perfil-inicial/${sessionData.rol}?userId=${sessionData.userId}&name=${encodeURIComponent(sessionData.nombreCompleto)}`);
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      setErrors({ 
        general: 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar OAuth con Google
    alert('Funcionalidad de Google OAuth próximamente disponible');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-primary p-8">
        
        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-primary mb-2">
            Hola de nuevo
          </h2>
          <p className="text-body-1 text-text-dark">
            Bienvenido de nuevo, te hemos extrañado como{' '}
            <span className="font-semibold text-primary">{defaultRole}</span>.
          </p>
        </div>

        {/* Error General */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-body-2 text-red-700 font-medium">
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-body-2 font-medium text-dark mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-text-light" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="tu@email.com"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors
                  text-body-1 text-dark placeholder:text-text-light
                  focus:outline-none focus:ring-2 focus:ring-primary/30
                  ${errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-light bg-white focus:border-primary'
                  }
                `}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-body-2 text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-body-2 font-medium text-dark mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-text-light" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••"
                className={`
                  w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-colors
                  text-body-1 text-dark placeholder:text-text-light
                  focus:outline-none focus:ring-2 focus:ring-primary/30
                  ${errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-light bg-white focus:border-primary'
                  }
                `}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-dark transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-body-2 text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 rounded-full font-bold text-white
              transition-all duration-300 flex items-center justify-center gap-2
              ${loading
                ? 'bg-light cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark shadow-primary hover:shadow-lg active:scale-95'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Enlace Recuperación de Contraseña */}
        <div className="mt-6 text-center">
          <Link 
            href="/recover-password"
            className="text-body-2 text-primary font-medium hover:text-primary-dark transition-colors hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-px flex-1 bg-light"></div>
          <span className="px-4 text-body-2 text-text-light">O</span>
          <div className="h-px flex-1 bg-light"></div>
        </div>

        {/* Botón Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl border-2 border-light bg-white hover:bg-background-light transition-all duration-300 flex items-center justify-center gap-3 text-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        {/* Nota de rol seleccionado */}
        <div className="mt-6 p-3 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-body-2 text-center text-dark">
            Iniciando como <span className="font-semibold text-primary">{defaultRole}</span>.{' '}
            <Link href="/" className="text-primary hover:underline">
              Cambiar rol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}