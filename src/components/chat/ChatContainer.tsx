/**
 * @file ChatContainer.tsx
 * @description Contenedor principal del chat con dos columnas
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React, { useState } from 'react';
import { ConversacionesList } from './ConversacionesList';
import { ChatWindow } from './ChatWindow';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Conversacion {
  id: string;
  otroUsuario: {
    id: string;
    nombre: string;
    email: string;
    avatar: string;
  };
  ultimoMensaje: {
    contenido: string;
    remitente: string;
    fechaHora: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const ChatContainer: React.FC = () => {
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<Conversacion | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return <div>Cargando...</div>;
  }

  const handleBack = () => {
    if (user.rol === 'Psicólogo') {
      router.push('/inicio/psicologo');
    } else {
      router.push('/inicio/paciente');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Lista de conversaciones - Ocultar en móvil si hay conversación seleccionada */}
      <div className={`${conversacionSeleccionada ? 'hidden lg:flex' : 'flex'} lg:w-[400px] w-full flex-col border-r border-gray-200`}>
        {/* Header de la lista */}
        <div 
          className="p-4 flex items-center justify-between shadow-sm"
          style={{ backgroundColor: 'var(--color-theme-primary)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Volver"
            >
              <ArrowLeft size={22} className="text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">Chats</h2>
          </div>
        </div>
        
        {/* Lista scrolleable */}
        <div className="flex-1 overflow-y-auto bg-white">
          <ConversacionesList
            onSelectConversacion={setConversacionSeleccionada}
            conversacionSeleccionadaId={conversacionSeleccionada?.id}
          />
        </div>
      </div>

      {/* Ventana de chat - Ocupa el espacio restante */}
      <div className={`${conversacionSeleccionada ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
        {conversacionSeleccionada ? (
          <ChatWindow
            conversacionId={conversacionSeleccionada.id}
            otroUsuario={conversacionSeleccionada.otroUsuario}
            miId={user.id}
            onBack={() => setConversacionSeleccionada(null)}
            rol={user.rol}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400 p-8">
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-theme-primary-light)' }}
              >
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-theme-primary)' }}>
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">MiauBloom Chat</p>
              <p className="text-sm text-gray-500">Selecciona una conversación para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

