'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Interfaz para Paciente
interface Paciente {
  id: string;
  nombre: string;
  avatar: string;
  status: string;
}

interface PatientCardProps {
  paciente: Paciente;
  href: string;
}

/**
 * Componente de Card de Paciente reutilizable
 */
export const PatientCard = ({ paciente, href }: PatientCardProps) => {
  const { nombre, avatar, status } = paciente;

  return (
    <Link
      href={href}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 w-full text-left flex items-center gap-3"
    >
      <div
        className="relative w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0"
        style={{ borderColor: 'var(--color-theme-primary-light)' }}
      >
        <Image
          src={avatar}
          alt={nombre || 'Avatar de Paciente'}
          fill
          className="object-cover pointer-events-none"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 mb-1 truncate">
          {nombre}
        </h4>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
            status === 'Estable'
              ? 'bg-green-100 text-green-600'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {status}
        </span>
      </div>
    </Link>
  );
};
