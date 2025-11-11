/**
 * @file ConversacionesList.tsx
 * @description Componente para listar conversaciones
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface OtroUsuario {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
}

interface UltimoMensaje {
  contenido: string;
  remitente: string;
  fechaHora: string;
}

interface Conversacion {
  id: string;
  otroUsuario: OtroUsuario;
  ultimoMensaje: UltimoMensaje | null;
  mensajesNoLeidos: number;
  createdAt: string;
  updatedAt: string;
}

interface ConversacionesListProps {
  onSelectConversacion: (conversacion: Conversacion) => void;
  conversacionSeleccionadaId?: string;
}

export const ConversacionesList: React.FC<ConversacionesListProps> = ({
  onSelectConversacion,
  conversacionSeleccionadaId,
}) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarConversaciones();
    const interval = setInterval(cargarConversaciones, 3000);
    return () => clearInterval(interval);
  }, []);

  const cargarConversaciones = async () => {
    try {
      const response = await fetch('/api/chat/conversaciones', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConversaciones(data.conversaciones || []);
        setError(null);
        setCargando(false);
      } else {
        setError('Error al cargar conversaciones');
        setCargando(false);
      }
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('Error al cargar conversaciones');
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias}d`;
    
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64 p-4 bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-theme-primary)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-500 dark:text-slate-500 text-sm">Cargando chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 bg-red-50 dark:bg-red-900/20 border-l-4 rounded-lg" style={{ borderLeftColor: 'var(--color-theme-primary)' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (conversaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-slate-400 p-8 bg-white dark:bg-slate-900">
        <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
          <MessageCircle size={40} style={{ color: 'var(--color-theme-primary)' }} />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">Sin conversaciones</p>
        <p className="text-sm text-gray-500 dark:text-slate-500">Tus chats aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
      {conversaciones.map((conversacion, index) => {
        const tieneNoLeidos = conversacion.mensajesNoLeidos > 0;
        
        return (
          <button
            key={conversacion.id}
            onClick={() => onSelectConversacion(conversacion)}
            className={`w-full text-left px-4 py-4 transition-all duration-150 active:scale-[0.98] ${
              conversacionSeleccionadaId === conversacion.id 
                ? 'dark:bg-slate-700' 
                : 'hover:bg-gray-50 dark:hover:bg-slate-800 active:bg-gray-100 dark:active:bg-slate-700'
            }`}
            style={conversacionSeleccionadaId === conversacion.id ? {
              backgroundColor: 'var(--color-theme-primary-light)',
            } : {}}
          >
            <div className="flex items-start gap-3">
              {/* Avatar con badge */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-slate-700">
                  <Image
                    src={conversacion.otroUsuario.avatar}
                    alt={conversacion.otroUsuario.nombre}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Badge verde online (opcional, decorativo) */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              
              {/* Contenido del chat */}
              <div className="flex-1 min-w-0 pt-0.5">
                {/* Nombre y hora */}
                <div className="flex items-baseline justify-between mb-1 gap-2">
                  <h3 className={`truncate text-base ${tieneNoLeidos ? 'font-bold text-gray-900 dark:text-slate-100' : 'font-medium text-gray-900 dark:text-slate-200'}`}>
                    {conversacion.otroUsuario.nombre}
                  </h3>
                  {conversacion.ultimoMensaje && (
                    <span 
                      className={`text-xs flex-shrink-0 ${tieneNoLeidos ? 'font-semibold' : 'text-gray-500'}`}
                      style={tieneNoLeidos ? { color: 'var(--color-theme-primary)' } : {}}
                    >
                      {formatearFecha(conversacion.ultimoMensaje.fechaHora)}
                    </span>
                  )}
                </div>
                
                {/* Último mensaje y badge */}
                <div className="flex items-center justify-between gap-2">
                  {conversacion.ultimoMensaje ? (
                    <p className={`text-sm truncate flex-1 ${tieneNoLeidos ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                      {conversacion.ultimoMensaje.contenido}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic flex-1">Toca para chatear</p>
                  )}
                  
                  {tieneNoLeidos && (
                    <div 
                      className="min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ backgroundColor: 'var(--color-theme-primary)' }}
                    >
                      <span className="text-white text-xs font-bold">
                        {conversacion.mensajesNoLeidos > 9 ? '9+' : conversacion.mensajesNoLeidos}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

