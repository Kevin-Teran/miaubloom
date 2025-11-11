# 📡 Servidor WebSocket - MiauBloom

## 🚀 Configuración

El proyecto ahora incluye un servidor Socket.io integrado para chat en tiempo real.

### ¿Qué hace el servidor?

- **Servidor Next.js + Socket.io**: El archivo `server.js` inicia Next.js y Socket.io en el mismo puerto (3000)
- **Chat en tiempo real**: Los mensajes se envían instantáneamente sin necesidad de recargar
- **Persistencia**: Todos los mensajes se guardan en la base de datos MySQL
- **Fallback HTTP**: Si WebSocket falla, automáticamente usa HTTP API

## 🎯 Cómo usar

### Desarrollo
```bash
npm run dev
```

Este comando ahora inicia:
1. ✅ Next.js (SSR, API Routes, páginas)
2. ✅ Socket.io (WebSocket para chat en tiempo real)
3. ✅ Puerto 3000 para todo

### Producción
```bash
npm run build
npm start
```

## 📋 Eventos WebSocket disponibles

### Cliente → Servidor

- `chat:join-room` - Unirse a una conversación
  ```js
  socket.emit('chat:join-room', { conversacionId, userId })
  ```

- `chat:send-message` - Enviar mensaje
  ```js
  socket.emit('chat:send-message', { conversacionId, contenido, userId, rol })
  ```

- `chat:typing` - Usuario está escribiendo
- `chat:stop-typing` - Usuario dejó de escribir
- `chat:mark-read` - Marcar mensaje como leído
- `chat:leave-room` - Salir de una conversación

### Servidor → Cliente

- `chat:message-received` - Nuevo mensaje recibido
- `chat:user-typing` - Otro usuario está escribiendo
- `chat:user-stop-typing` - Otro usuario dejó de escribir
- `chat:message-read` - Mensaje marcado como leído
- `chat:error` - Error al procesar acción

## 🔧 Arquitectura

```
Cliente (React/Next.js)
    ↓
Socket.io Client (/src/lib/socket.ts)
    ↓
WebSocket Connection (ws://)
    ↓
Socket.io Server (server.js)
    ↓
API Routes (/api/chat/mensajes)
    ↓
Prisma ORM
    ↓
MySQL Database
```

## ✨ Características

- ✅ **Tiempo real**: Mensajes instantáneos sin polling
- ✅ **Persistencia**: Todos los mensajes se guardan en DB
- ✅ **Reconexión automática**: Socket.io maneja desconexiones
- ✅ **Fallback HTTP**: Si WebSocket falla, usa API REST
- ✅ **Salas privadas**: Cada conversación es una sala separada
- ✅ **Estado de usuarios**: Saber quién está conectado

## 🐛 Troubleshooting

**Problema**: El servidor no inicia
```bash
# Matar procesos en puerto 3000
killall node
fuser -k 3000/tcp
npm run dev
```

**Problema**: WebSocket no conecta
- Verificar que `npm run dev` esté corriendo
- Revisar consola del navegador para errores
- El sistema usa fallback HTTP automáticamente

**Problema**: Los mensajes no aparecen
- Verificar conexión WebSocket en DevTools → Network → WS
- Si WebSocket falla, los mensajes se envían por HTTP

