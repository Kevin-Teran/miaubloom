/**
 * @file page.tsx
 * @route src/app/identificacion/page.tsx
 * @description Pantalla de identificación para seleccionar rol (Paciente o Psicólogo).
 * @author Kevin Mariano
 * @version 1.0.2 
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface Dot {
  id: number;
  style: React.CSSProperties;
}

interface RoleCardProps {
  role: 'Paciente' | 'Psicólogo';
  imageSrc: string;
  isSelected: boolean;
  onSelect: () => void;
}

function RoleCard({ role, imageSrc, isSelected, onSelect }: RoleCardProps) {
  const selectedBgColor = "var(--color-theme-primary)";
  const unselectedBgColor = "var(--color-theme-primary-light)";
  const textColor = "var(--color-theme-primary)";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative w-40 h-auto pt-4 px-4 pb-0
        rounded-3xl md:rounded-[2rem]
        transition-all duration-300 transform
        flex flex-col items-center justify-start
        border-none select-none cursor-pointer
        overflow-hidden
        min-h-[220px]
        ${isSelected
          ? 'shadow-xl scale-[1.03]'
          : 'shadow-md hover:shadow-lg'
        }
      `}
      style={{
        backgroundColor: isSelected ? selectedBgColor : unselectedBgColor,
      }}
    >
      <div className="flex justify-center items-center w-full mt-1 mb-2">
        <span
          className="font-bold text-lg"
          style={{ color: isSelected ? 'white' : textColor }}
        >
          {role}
        </span>
      </div>
      <div className="relative flex-grow w-full">
        <Image
          src={imageSrc}
          alt={`Avatar de ${role}`}
          fill
          sizes="(max-width: 768px) 50vw, 160px"
          className="object-contain object-bottom pointer-events-none"
          unoptimized
        />
      </div>
    </button>
  );
}

export default function IdentificacionPage() {
  const [selectedRole, setSelectedRole] = useState<'Paciente' | 'Psicólogo' | null>(null);
  const router = useRouter();
  const [dots, setDots] = useState<Dot[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Ya no necesitamos verificar aquí, el AuthContext se encarga
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
     if (isLoadingAuth) return;

    const generatedDots: Dot[] = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 4 + 3;
      generatedDots.push({
        id: i,
        style: {
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-bubble ${Math.random() * 10 + 8}s infinite ease-in-out alternate`,
          animationDelay: `${Math.random() * 8}s`,
        },
      });
    }
    setDots(generatedDots);
  }, [isLoadingAuth]);

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'Paciente') {
        router.push('/bienvenido');
      } else if (selectedRole === 'Psicólogo') {
        router.push(`/auth/login/psicologo`);
      }
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
         <LoadingIndicator
            text="Cargando tu experiencia..."
          />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-white p-6 relative overflow-hidden items-center justify-center select-none"
    >
      {/* Decoraciones */}
      <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 opacity-60">
        <Image src="/assets/ellipse-corner.svg" alt="Decoración" fill priority className="object-contain pointer-events-none" unoptimized />
      </div>
      <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 opacity-60 transform rotate-180">
        <Image src="/assets/ellipse-corner.svg" alt="Decoración" fill className="object-contain pointer-events-none" unoptimized />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {dots.map((dot) => (
          <div key={dot.id} style={dot.style}>
            <Image src="/assets/punto.png" alt="" fill sizes={`${dot.style.width}`} className="opacity-50 pointer-events-none" unoptimized />
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10 w-full max-w-md">
        <header className="w-full text-center mb-12">
          <Image src="/assets/logo-2.png" alt="Logo de MiauBloom" width={80} height={80} priority style={{ height: 'auto', width: 'auto' }} className="mx-auto drop-shadow-md mb-4 pointer-events-none" />
          <Image src="/assets/MiauBloom-r.svg" alt="MiauBloom Crece y siente" width={200} height={60} style={{ height: 'auto', width: 'auto' }} className="mx-auto pointer-events-none" />
        </header>
        <main className="w-full flex flex-col items-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">¿Cual eres tú?</h1>
          <div className="flex justify-center gap-6 w-full">
            <RoleCard role="Paciente" imageSrc="/assets/avatar-paciente.png" isSelected={selectedRole === 'Paciente'} onSelect={() => setSelectedRole('Paciente')} />
            <RoleCard role="Psicólogo" imageSrc="/assets/avatar-psicologo.png" isSelected={selectedRole === 'Psicólogo'} onSelect={() => setSelectedRole('Psicólogo')} />
          </div>
        </main>
        <footer className="w-full flex justify-center">
          <button onClick={handleContinue} disabled={!selectedRole} className={`w-full max-w-[280px] py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-md select-none ${selectedRole ? 'text-white hover:opacity-95 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={{ backgroundColor: selectedRole ? 'var(--color-theme-primary)' : 'inherit' }}>
            Comenzar
          </button>
        </footer>
      </div>
    </div>
  );
}