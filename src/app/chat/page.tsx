/**
 * @file page.tsx
 * @route src/app/chat/page.tsx
 * @description Página de chat
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React from 'react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { useRouteProtection } from '@/hooks/useRouteProtection';

export default function ChatPage() {
  const { isLoading } = useRouteProtection(['Psicólogo', 'Paciente']);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <ChatContainer />
    </div>
  );
}

