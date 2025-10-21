"use client";

/**
 * @file page.tsx
 * @route src/app/seleccionar-rol/page.tsx
 * @description Pantalla de identificación para seleccionar rol (Paciente o Psicólogo)
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * @interface RoleCardProps
 * @description Propiedades del componente de tarjeta de rol
 */
interface RoleCardProps {
  role: 'Paciente' | 'Psicólogo';
  isSelected: boolean;
  onSelect: (role: 'Paciente' | 'Psicólogo') => void;
}

/**
 * @component RoleCard
 * @description Tarjeta interactiva para seleccionar un rol
 */
function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
  const avatarImage = role === 'Paciente'
    ? '/assets/avatar-paciente.png'
    : '/assets/avatar-psicologo.png';

  return (
    <div
      onClick={() => onSelect(role)}
      className={`
        relative flex flex-col items-center p-6 rounded-3xl cursor-pointer 
        transition-all duration-300 transform hover:scale-105 w-full
        ${isSelected 
          ? 'bg-gradient-to-br from-pink-100 to-pink-50 shadow-xl border-4 border-pink-400 -translate-y-2' 
          : 'bg-white shadow-md border-2 border-gray-200 hover:border-pink-300'
        }
      `}
    >
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-full p-2 shadow-lg animate-bounce">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Avatar con efecto de brillo */}
      <div className="relative mb-4">
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        )}
        <div className="relative w-28 h-28">
          <Image
            src={avatarImage}
            alt={`Avatar de ${role}`}
            width={112}
            height={112}
            className="rounded-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Etiqueta del rol */}
      <span
        className={`
          font-bold text-lg transition-colors
          ${isSelected ? 'text-pink-600' : 'text-gray-700'}
        `}
      >
        {role}
      </span>

      {/* Descripción */}
      <p className={`
        text-xs text-center mt-2 transition-colors
        ${isSelected ? 'text-pink-500' : 'text-gray-400'}
      `}>
        {role === 'Paciente' 
          ? 'Busco apoyo emocional' 
          : 'Brindo apoyo profesional'
        }
      </p>
    </div>
  );
}

/**
 * @component SelectRolePage
 * @description Página principal de selección de rol
 */
export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'Paciente' | 'Psicólogo' | null>(null);
  const router = useRouter();

  /**
   * @function handleSelectRole
   * @description Maneja la selección de un rol
   */
  const handleSelectRole = (role: 'Paciente' | 'Psicólogo') => {
    setSelectedRole(role);
  };

  /**
   * @function handleContinue
   * @description Navega a la página de login con el rol seleccionado
   */
  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/login?role=${selectedRole.toLowerCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 relative overflow-hidden">
      {/* Decoración de fondo animada */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Logo y título */}
      <div className="w-full max-w-md text-center pt-8 relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <Image
            src="/assets/logo.png"
            alt="Logo de MiauBloom"
            width={120}
            height={120}
            className="mx-auto relative z-10 drop-shadow-2xl"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¿Cuál eres tú?
        </h1>
        <p className="text-gray-500 text-sm">
          Selecciona tu rol para continuar
        </p>
      </div>

      {/* Cards de selección */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg my-auto relative z-10">
        <RoleCard
          role="Paciente"
          isSelected={selectedRole === 'Paciente'}
          onSelect={handleSelectRole}
        />
        <RoleCard
          role="Psicólogo"
          isSelected={selectedRole === 'Psicólogo'}
          onSelect={handleSelectRole}
        />
      </div>

      {/* Botón de continuar */}
      <div className="w-full max-w-md pb-8 relative z-10">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`
            w-full py-4 rounded-full font-bold text-lg transition-all duration-300 
            shadow-lg transform
            ${selectedRole
              ? 'bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {selectedRole ? 'Comenzar' : 'Selecciona un rol'}
        </button>

        {/* Indicador visual */}
        {selectedRole && (
          <p className="text-center text-sm text-pink-500 mt-3 animate-pulse">
            ¡Perfecto! Continúa como {selectedRole}
          </p>
        )}
      </div>
    </div>
  );
}