/**
 * @file ProfileHeader.tsx
 * @description Componente de encabezado del perfil con avatar, nombre e información del usuario
 * 
 * Tipografía (Roboto):
 * - Nombre: 28px SemiBold (#070806)
 * - Label: 14px Regular (#070806)
 * - Nickname: 16px Medium (#070806)
 */

import Image from 'next/image';

interface ProfileHeaderProps {
  nombre: string;
  avatar: string;
  nicknameAvatar: string;
}

export function ProfileHeader({ nombre, avatar, nicknameAvatar }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Contenedor del perfil */}
      <div className="flex flex-col items-center pt-8 pb-8">
        {/* Avatar */}
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={avatar}
            alt={nombre}
            fill
            className="rounded-full object-cover border-4"
            style={{ borderColor: '#F2C2C1' }}
            unoptimized
          />
        </div>

        {/* Nombre */}
        <h1 className="text-center mb-3 font-roboto" style={{ color: '#070806', fontSize: '28px', fontWeight: '600' }}>
          {nombre}
        </h1>

        {/* Nickname Avatar */}
        <p className="text-center mb-1 font-roboto" style={{ color: '#070806', fontSize: '14px', fontWeight: '400' }}>
          ID Nombre avatar
        </p>
        <p className="text-center font-roboto" style={{ color: '#070806', fontSize: '16px', fontWeight: '500' }}>
          {nicknameAvatar}
        </p>
      </div>
    </div>
  );
}
