/**
 * @file ChatNotificationBadge.tsx
 * @description Badge de notificaciones para el icono de chat
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChatNotificationBadgeProps {
  className?: string;
}

export const ChatNotificationBadge: React.FC<ChatNotificationBadgeProps> = ({ className = '' }) => {
  const [totalNoLeidos, setTotalNoLeidos] = useState(0);

  useEffect(() => {
    const fetchNoLeidos = async () => {
      try {
        const response = await fetch('/api/chat/no-leidos', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const nuevoTotal = data.totalMensajesNoLeidos || 0;
          setTotalNoLeidos(nuevoTotal);
        }
      } catch (error) {
        // Error silencioso
      }
    };

    fetchNoLeidos();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchNoLeidos, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/chat"
      className={`relative p-2 hover:bg-gray-100 rounded-full transition-colors ${className}`}
      title="Chat"
    >
      <svg
        className="w-6 h-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      {totalNoLeidos > 0 && (
        <span 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white transition-all duration-200"
          style={{ backgroundColor: 'var(--color-theme-primary)' }}
        >
          {totalNoLeidos > 9 ? '9+' : totalNoLeidos}
        </span>
      )}
    </Link>
  );
};

