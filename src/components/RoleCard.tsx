/**
 * @file RoleCard.tsx
 * @route src/components/RoleCard.tsx
 * @description Componente de tarjeta reutilizable para seleccionar un rol.
 * @author Kevin Mariano
 * @version 1.0.3
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { pulseHighlight } from '@/lib/animations';

interface RoleCardProps {
  role: string;
  isSelected: boolean;
  onSelect: (role: string) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const avatarImage =
    role === 'Paciente'
      ? '/assets/avatar-paciente.png' /* <-- RUTA ACTUALIZADA */
      : '/assets/avatar-psicologo.png'; /* <-- RUTA ACTUALIZADA */

  const handleClick = () => {
    if (cardRef.current) {
      pulseHighlight(cardRef.current);
    }
    onSelect(role);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 w-1/2 active:scale-95 ${
        isSelected ? 'border-miaubloom-pink bg-pink-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-2 w-24 h-24 relative">
        <Image
          src={avatarImage}
          alt={`Avatar de ${role}`}
          width={96}
          height={96}
          className="rounded-full object-contain"
        />
      </div>
      <span
        className={`font-semibold ${
          isSelected ? 'text-miaubloom-pink' : 'text-gray-700'
        }`}
      >
        {role}
      </span>
    </div>
  );
};

export default RoleCard;