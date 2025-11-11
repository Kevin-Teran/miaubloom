/**
 * @file ChatWindow.tsx
 * @description Componente para la ventana de chat
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { initializeSocket, getSocket, chatEvents } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

interface Mensaje {
  id: string;
  conversacionId: string;
  remitente: string;
  remitenteId: string;
  contenido: string;
  leido: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  conversacionId: string;
  otroUsuario: {
    id: string;
    nombre: string;
    avatar: string;
  };
  miId: string;
  onBack?: () => void;
  rol: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversacionId,
  otroUsuario,
  miId,
  onBack,
  rol,
}) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otroUsuarioEscribiendo, setOtroUsuarioEscribiendo] = useState(false);
  const [socketActual, setSocketActual] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar WebSocket
  useEffect(() => {
    const socket = initializeSocket();
    setSocketActual(socket);

    // Unirse a la sala de conversación
    socket.emit(chatEvents.JOIN_ROOM, { conversacionId, userId: miId });

    // Escuchar nuevos mensajes
    socket.on(chatEvents.MESSAGE_RECEIVED, (data) => {
      setMensajes((prev) => {
        // Evitar duplicados
        const existe = prev.some(msg => msg.id === data.mensaje.id);
        if (existe) return prev;
        return [...prev, data.mensaje];
      });
    });

    // Escuchar marca de lectura
    socket.on(chatEvents.MESSAGE_READ, (data) => {
      setMensajes((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, leido: true } : msg
        )
      );
    });

    // Escuchar cuando el otro usuario está escribiendo
    socket.on(chatEvents.USER_TYPING, (data) => {
      if (data.userId !== miId) {
        setOtroUsuarioEscribiendo(true);
      }
    });

    // Escuchar cuando el otro usuario deja de escribir
    socket.on(chatEvents.USER_STOPPED_TYPING, (data) => {
      if (data.userId !== miId) {
        setOtroUsuarioEscribiendo(false);
      }
    });

    return () => {
      socket.emit(chatEvents.LEAVE_ROOM, { conversacionId });
      // Limpiar todos los listeners
      socket.off(chatEvents.MESSAGE_RECEIVED);
      socket.off(chatEvents.MESSAGE_READ);
      socket.off(chatEvents.USER_TYPING);
      socket.off(chatEvents.USER_STOPPED_TYPING);
    };
  }, [conversacionId, miId]);

  const cargarMensajes = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/chat/mensajes?conversacionId=${conversacionId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMensajes(data.mensajes || []);
        setCargando(false);
        setError(null);
      } else {
        setCargando(false);
      }
    } catch (err) {
      setCargando(false);
    }
  }, [conversacionId]);

  // Cargar mensajes iniciales solo una vez
  useEffect(() => {
    cargarMensajes();
  }, [cargarMensajes]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleTyping = () => {
    // Emitir evento al servidor
    if (socketActual?.connected) {
      socketActual.emit(chatEvents.TYPING, { conversacionId, userId: miId });
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Después de 2 segundos de inactividad, emitir stop-typing
    typingTimeoutRef.current = setTimeout(() => {
      if (socketActual?.connected) {
        socketActual.emit(chatEvents.STOP_TYPING, { conversacionId, userId: miId });
      }
    }, 2000);
  };

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoMensaje.trim()) return;

    // Emitir stop-typing al enviar mensaje
    if (socketActual?.connected) {
      socketActual.emit(chatEvents.STOP_TYPING, { conversacionId, userId: miId });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const mensajeAEnviar = nuevoMensaje;
    setNuevoMensaje('');
    setEnviando(true);
    
    try {
      // Enviar por WebSocket (el servidor guardará en DB)
      if (socketActual?.connected) {
        socketActual.emit(chatEvents.SEND_MESSAGE, {
          conversacionId,
          contenido: mensajeAEnviar,
          userId: miId,
          rol,
        });
        setError(null);
      } else {
        // Fallback a HTTP si WebSocket no está conectado
        const response = await fetch('/api/chat/mensajes', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversacionId,
            contenido: mensajeAEnviar,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Agregar el mensaje inmediatamente a la lista (evitando duplicados)
          if (data.mensaje) {
            setMensajes((prev) => {
              const existe = prev.some(msg => msg.id === data.mensaje.id);
              if (existe) return prev;
              return [...prev, data.mensaje];
            });
          }
          setError(null);
        } else {
          const data = await response.json();
          setError(data.message || 'Error al enviar mensaje');
        }
      }
    } catch (err) {
      setError('Error al enviar mensaje');
    } finally {
      setEnviando(false);
    }
  };

  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 chat-window-container">
      {/* Header estilo WhatsApp con color del tema */}
      <div 
        className="flex items-center gap-3 px-4 py-3 shadow-sm"
        style={{ backgroundColor: 'var(--color-theme-primary)' }}
      >
        {onBack && (
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all lg:hidden active:scale-95"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}
        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/50 transition-all">
          <Image
            src={otroUsuario.avatar}
            alt={otroUsuario.nombre}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-white text-base leading-tight">{otroUsuario.nombre}</h2>
          <p className="text-xs text-white/90 leading-tight">
            {rol === 'Paciente' ? 'Tu psicólogo' : 'Paciente'}
          </p>
        </div>
      </div>

      {/* Mensajes - Fondo tipo WhatsApp con wallpaper */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2.5 relative bg-white dark:bg-slate-800"
        style={{ 
          backgroundColor: 'var(--chat-bg, #e5ddd5)',
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `
        }}
      >
        {cargando ? (
          <div className="flex justify-center items-center h-full">
            <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm">
              <p className="text-gray-600 dark:text-slate-300">Cargando mensajes...</p>
            </div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm text-center">
              <p className="text-gray-600 dark:text-slate-300">Inicia una conversación escribiendo tu primer mensaje</p>
            </div>
          </div>
        ) : (
          mensajes.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.remitenteId === miId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3.5 py-2.5 shadow-md transition-all ${
                  msg.remitenteId === miId
                    ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                    : 'bg-white dark:bg-slate-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                }`}
                style={msg.remitenteId === miId ? {
                  backgroundColor: 'var(--color-theme-primary)',
                  color: 'white'
                } : {}}
              >
                <p className="break-words text-[15px] leading-relaxed dark:text-white" style={msg.remitenteId === miId ? {} : { color: 'inherit' }}>{msg.contenido}</p>
                <div className={`flex items-center justify-end gap-1.5 mt-1 ${msg.remitenteId === miId ? 'text-white/80' : 'text-gray-500 dark:text-slate-300'}`}>
                  <p className="text-[11px]">{formatearHora(msg.createdAt)}</p>
                  {msg.remitenteId === miId && (
                    <span className="text-[12px] font-semibold" style={{ color: msg.leido ? '#34D399' : 'rgba(255,255,255,0.7)' }}>
                      {msg.leido ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Input estilo WhatsApp mejorado */}
      <form onSubmit={enviarMensaje} className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Input con ícono emoji */}
          <div className="flex-1 flex items-center bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-full px-4 py-2 focus-within:border-gray-400 dark:focus-within:border-slate-500 transition-colors">
            <button
              type="button"
              className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors mr-2 active:scale-95"
              title="Emoji"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => {
                setNuevoMensaje(e.target.value);
                handleTyping();
              }}
              placeholder="Escribe un mensaje..."
              className="flex-1 outline-none bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-500 text-[15px]"
              disabled={enviando}
            />
          </div>
          
          {/* Botón enviar */}
          <button
            type="submit"
            disabled={enviando || !nuevoMensaje.trim()}
            className="p-3 rounded-full text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl active:scale-95 shadow-lg"
            style={{ backgroundColor: 'var(--color-theme-primary)' }}
          >
            {enviando ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

