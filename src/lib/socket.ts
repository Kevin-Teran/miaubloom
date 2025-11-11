/**
 * @file socket.ts
 * @description Configuración del cliente Socket.io para chat en tiempo real
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Conectado:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Desconectado');
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Eventos del chat
export const chatEvents = {
  // Emitir eventos
  SEND_MESSAGE: 'chat:send-message',
  TYPING: 'chat:typing',
  STOP_TYPING: 'chat:stop-typing',
  JOIN_ROOM: 'chat:join-room',
  LEAVE_ROOM: 'chat:leave-room',
  MARK_READ: 'chat:mark-read',

  // Recibir eventos
  MESSAGE_RECEIVED: 'chat:message-received',
  USER_TYPING: 'chat:user-typing',
  USER_STOPPED_TYPING: 'chat:user-stop-typing',
  MESSAGE_READ: 'chat:message-read',
  USER_JOINED: 'chat:user-joined',
  USER_LEFT: 'chat:user-left',
  ERROR: 'chat:error',
};

