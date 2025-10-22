"use client";

/**
 * @file page.tsx
 * @route src/app/identificacion/page.tsx
 * @description Pantalla de identificación para seleccionar rol (Paciente o Psicólogo).
 * @author Kevin Mariano
 * @version 1.0.0 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const selectedColor = "#F4A9A0";
  const unselectedColor = "#FEF6F5";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative w-40 h-auto p-4 rounded-3xl
        transition-all duration-300
        flex flex-col items-center justify-start gap-4
        border-2
        ${isSelected
          ? 'border-transparent shadow-lg'
          : 'border-transparent hover:border-gray-200 shadow-md'
        }
      `}
      style={{
        backgroundColor: isSelected ? selectedColor : unselectedColor,
      }}
    >
      {/* Contenido superior de la tarjeta */}
      <div className="flex justify-center items-center w-full">
        <span 
          className="font-bold text-lg"
          style={{ color: isSelected ? 'white' : '#F4A9A0' }}
        >
          {role}
        </span>
      </div>
      {/* Imagen del Avatar */}
      <div className="relative w-28 h-28">
        <Image
          src={imageSrc}
          alt={`Avatar de ${role}`}
          fill
          className="object-contain"
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

  useEffect(() => {
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
  }, []);

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/login?role=${selectedRole.toLowerCase()}`);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-white p-6 relative overflow-hidden items-center justify-center"
    >
      <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 opacity-60">
        <Image src="/assets/ellipse-corner.svg" alt="Decoración" fill className="object-contain" />
      </div>
      <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 opacity-60 transform rotate-180">
        <Image src="/assets/ellipse-corner.svg" alt="Decoración" fill className="object-contain" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {dots.map((dot) => (
          <div key={dot.id} style={dot.style}>
            <Image src="/assets/punto.png" alt="" layout="fill" className="opacity-50" />
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1 relative z-10 w-full max-w-md">
        
        <header className="w-full text-center mb-12">
          <Image src="/assets/logo.svg" alt="Logo de MiauBloom" width={80} height={80} className="mx-auto drop-shadow-md mb-2" />
          <div className="flex flex-col items-center" style={{ color: '#F4A9A0' }}>
            <span className="text-3xl font-bold -mb-2">Miau</span>
            <span className="text-7xl font-bold">Bloom</span>
          </div>
          <p className="text-lg font-medium mt-1" style={{ color: '#F4A9A0' }}>
            Crece y siente
          </p>
        </header>

        <main className="w-full flex flex-col items-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ¿Cual eres tú?
          </h1>
          <div className="flex justify-center gap-6 w-full">
            <RoleCard
              role="Paciente"
              imageSrc="/assets/avatar-paciente.png"
              isSelected={selectedRole === 'Paciente'}
              onSelect={() => setSelectedRole('Paciente')}
            />
            <RoleCard
              role="Psicólogo"
              imageSrc="/assets/avatar-psicologo.png"
              isSelected={selectedRole === 'Psicólogo'}
              onSelect={() => setSelectedRole('Psicólogo')}
            />
          </div>
        </main>

        <footer className="w-full flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              w-full max-w-[280px] py-4 rounded-full font-bold text-lg 
              transition-all duration-300 shadow-md
              ${selectedRole
                ? 'text-white hover:opacity-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            style={{ 
              backgroundColor: selectedRole ? '#F4A9A0' : undefined 
            }}
          >
            Comenzar
          </button>
        </footer>
        
      </div>
    </div>
  );
}