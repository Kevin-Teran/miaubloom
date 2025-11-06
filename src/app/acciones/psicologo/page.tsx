"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IconButton from '@/components/ui/IconButton';

export default function AccionesPsicologoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white">
      {/* Encabezado */}
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <IconButton
            icon="back"
            onClick={() => router.back()}
            bgColor="var(--color-theme-primary)"
            ariaLabel="Volver"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Acciones
          </h1>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto p-4 pt-6">
        <div className="space-y-4">
          {/* Card: Citas */}
          <Link 
            href="/inicio/psicologo/citas"
            className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4"
            style={{ borderColor: 'var(--color-theme-primary)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Mis Citas</h2>
                <p className="text-sm text-gray-600">Ver y gestionar todas tus citas programadas</p>
              </div>
              <div className="w-12 h-12 bg-[var(--color-theme-primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" style={{ color: 'var(--color-theme-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card: Tareas */}
          <Link 
            href="/inicio/psicologo/tareas"
            className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4"
            style={{ borderColor: '#FF9800' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Asignar Tareas</h2>
                <p className="text-sm text-gray-600">Crear y asignar nuevas tareas a tus pacientes</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card: Pacientes */}
          <Link 
            href="/inicio/psicologo/pacientes"
            className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4"
            style={{ borderColor: '#9C27B0' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Mis Pacientes</h2>
                <p className="text-sm text-gray-600">Ver lista completa de tus pacientes</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm6-6h-2m0 0h-2m2 0v2m0-2v-2" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
