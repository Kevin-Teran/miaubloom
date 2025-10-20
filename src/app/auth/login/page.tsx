"use client";

/**
 * @file page.tsx
 * @route src/app/auth/login/page.tsx
 * @description Página de inicio de sesión para Pacientes y Psicólogos.
 * @author Kevin Mariano
 * @version 1.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'paciente';
  const isPatient = role === 'paciente';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <Link href="/seleccionar-rol" className="absolute top-6 left-6 text-gray-500 hover:text-gray-800">
        &larr; Volver
      </Link>

      <div className="text-center w-full max-w-sm">
        <Image
          src={isPatient ? '/assets/avatar-paciente.png' : '/assets/avatar-psicologo.png'}
          alt={`Avatar ${role}`}
          width={120}
          height={120}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          ¡Hola {isPatient ? 'Paciente' : 'Psicólogo'}!
        </h1>
        <p className="text-gray-500 mt-2">Ingresa tus datos para comenzar</p>
      </div>

      <form className="w-full max-w-sm mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-miaubloom-pink focus:border-miaubloom-pink"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-miaubloom-pink focus:border-miaubloom-pink"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full text-white py-3 rounded-full font-bold text-lg bg-miaubloom-pink hover:bg-pink-500 transition-colors"
        >
          Ingresar
        </button>

        <div className="text-center text-sm text-gray-500">
          <p>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="font-medium text-miaubloom-pink">
              Regístrate aquí
            </Link>
          </p>
          <Link
            href="/auth/forgot-password"
            className="font-medium text-gray-400 hover:text-gray-600 mt-2 block"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </form>
    </div>
  );
}

// Envolvemos el componente en Suspense para que useSearchParams funcione correctamente
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}