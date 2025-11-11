/**
 * @file server.js
 * @description Servidor Socket.io para chat en tiempo real
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Preparar Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  // Configurar Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : `http://${hostname}:${port}`,
      credentials: true,
    },
  });

  // Almacenamiento en memoria de usuarios conectados por sala
  const roomUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

    // Unirse a una sala de conversación
    socket.on('chat:join-room', ({ conversacionId, userId }) => {
      socket.join(conversacionId);
      
      // Guardar información del usuario en la sala
      if (!roomUsers.has(conversacionId)) {
        roomUsers.set(conversacionId, new Set());
      }
      roomUsers.get(conversacionId).add(userId);
      
      console.log(`[SOCKET] Usuario ${userId} se unió a la sala ${conversacionId}`);
      
      // Notificar a otros en la sala
      socket.to(conversacionId).emit('chat:user-joined', { userId });
    });

    // Enviar mensaje
    socket.on('chat:send-message', async ({ conversacionId, contenido, userId, rol }) => {
      try {
        console.log(`[SOCKET] Mensaje recibido de ${userId} en sala ${conversacionId}`);
        
        // Guardar mensaje en la base de datos usando la API
        const response = await fetch(`http://${hostname}:${port}/api/chat/mensajes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': socket.handshake.headers.cookie || '',
          },
          body: JSON.stringify({
            conversacionId,
            contenido,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Emitir mensaje a todos en la sala (incluyendo el remitente)
          io.to(conversacionId).emit('chat:message-received', {
            mensaje: data.mensaje,
          });
          
          console.log(`[SOCKET] Mensaje enviado a sala ${conversacionId}`);
        } else {
          socket.emit('chat:error', {
            message: 'Error al guardar el mensaje',
          });
        }
      } catch (error) {
        console.error('[SOCKET] Error al procesar mensaje:', error);
        socket.emit('chat:error', {
          message: 'Error al enviar el mensaje',
        });
      }
    });

    // Usuario está escribiendo
    socket.on('chat:typing', ({ conversacionId, userId }) => {
      socket.to(conversacionId).emit('chat:user-typing', { userId });
    });

    // Usuario dejó de escribir
    socket.on('chat:stop-typing', ({ conversacionId, userId }) => {
      socket.to(conversacionId).emit('chat:user-stop-typing', { userId });
    });

    // Marcar mensaje como leído
    socket.on('chat:mark-read', ({ conversacionId, messageId }) => {
      socket.to(conversacionId).emit('chat:message-read', { messageId });
    });

    // Salir de una sala
    socket.on('chat:leave-room', ({ conversacionId, userId }) => {
      socket.leave(conversacionId);
      
      if (roomUsers.has(conversacionId)) {
        roomUsers.get(conversacionId).delete(userId);
        if (roomUsers.get(conversacionId).size === 0) {
          roomUsers.delete(conversacionId);
        }
      }
      
      console.log(`[SOCKET] Usuario ${userId} salió de la sala ${conversacionId}`);
      socket.to(conversacionId).emit('chat:user-left', { userId });
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`[SOCKET] Cliente desconectado: ${socket.id}`);
      
      // Limpiar usuario de todas las salas
      roomUsers.forEach((users, conversacionId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) {
            roomUsers.delete(conversacionId);
          }
        }
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error('[SERVER] Error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`\n🚀 Servidor listo en http://${hostname}:${port}`);
      console.log(`📡 Socket.io escuchando en el mismo puerto\n`);
    });
});

