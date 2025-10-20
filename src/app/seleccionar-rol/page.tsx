"use client";

/**
 * @file page.tsx
 * @route src/app/seleccionar-rol/page.tsx
 * @description Página para que el usuario seleccione su rol (Paciente o Psicólogo).
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RoleCard from '@/components/RoleCard'; // Importa desde la nueva ruta de componentes

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/login?role=${selectedRole.toLowerCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-6">
      <div className="w-full max-w-sm text-center pt-12">
        <Image
          src="/assets/logo.png" 
          alt="Logo de MiauBloom"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h1 className="text-2xl font-semibold text-gray-700 mt-4">¿Cuál eres tú?</h1>
      </div>

      <div className="flex justify-center gap-4 w-full max-w-sm my-8">
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

      <div className="w-full max-w-sm pb-12">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full text-white py-3 rounded-full font-bold text-lg transition-colors ${
            selectedRole
              ? 'bg-[#EE7E7F] hover:bg-pink-500'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}