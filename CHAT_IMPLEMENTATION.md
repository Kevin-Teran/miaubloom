# Implementación de Chat en MiauBloom

## Resumen

Se ha implementado una **funcionalidad de chat completamente funcional** que permite que psicólogos y pacientes se comuniquen de manera segura.

### Características principales

✅ **Chat entre psicólogos y pacientes asignados**
- Los psicólogos pueden chatear solo con sus pacientes asignados
- Los pacientes pueden chatear solo con su psicólogo asignado

✅ **Interfaz moderna y responsiva**
- Diseño de dos columnas en desktop (lista de conversaciones + ventana de chat)
- Diseño de una columna en móvil (navegable)
- Integración con la navegación principal

✅ **Funcionalidades de chat**
- Envío y recepción de mensajes en tiempo real (con polling cada 2 segundos)
- Historial de mensajes persistente
- Marcado automático de mensajes como leídos
- Indicadores de hora de envío
- Avatares de usuarios
- Nombres de conversaciones personalizados

✅ **Seguridad**
- Autenticación JWT obligatoria en todos los endpoints
- Validación de permisos: cada usuario solo puede acceder a sus conversaciones asignadas
- Encriptación de datos en la base de datos

## Estructura de archivos

### Backend (API)

```
src/app/api/chat/
├── conversaciones/route.ts      # GET/POST para conversaciones
└── mensajes/route.ts             # GET/POST para mensajes
```

### Frontend (Componentes)

```
src/components/chat/
├── ChatContainer.tsx             # Contenedor principal con layout
├── ChatWindow.tsx                # Ventana de chat con input
└── ConversacionesList.tsx        # Lista de conversaciones

src/app/
├── chat/page.tsx                 # Página del chat
```

### Base de datos

```
prisma/
├── schema.prisma                 # Modelos Conversacion y Mensaje agregados
└── migrations/20251110_add_chat/ # Migración SQL
```

## Modelos de Base de Datos

### Conversacion
```typescript
model Conversacion {
  id               String    @id @default(uuid())
  psicologoId      String    
  pacienteId       String    
  psicologo        PerfilPsicologo (relación)
  paciente         PerfilPaciente (relación)
  mensajes         Mensaje[]
  createdAt        DateTime
  updatedAt        DateTime
  
  @@unique([psicologoId, pacienteId])  // Una conversación por par
}
```

### Mensaje
```typescript
model Mensaje {
  id               String    @id @default(uuid())
  conversacionId   String
  remitente        String    // "paciente" o "psicologo"
  remitenteId      String
  contenido        String
  leido            Boolean   @default(false)
  conversacion     Conversacion (relación)
  createdAt        DateTime
}
```

## Endpoints de API

### GET /api/chat/conversaciones
Obtiene todas las conversaciones del usuario autenticado.

**Parámetros:** Ninguno (se obtiene del JWT)

**Respuesta:**
```json
{
  "success": true,
  "conversaciones": [
    {
      "id": "conversacion-uuid",
      "otroUsuario": {
        "id": "usuario-id",
        "nombre": "Nombre del Psicólogo",
        "email": "email@example.com",
        "avatar": "/ruta/avatar.png"
      },
      "ultimoMensaje": {
        "contenido": "Hola, ¿cómo estás?",
        "remitente": "psicologo",
        "fechaHora": "2025-11-10T10:30:00Z"
      },
      "createdAt": "2025-11-10T08:00:00Z",
      "updatedAt": "2025-11-10T10:30:00Z"
    }
  ],
  "total": 5
}
```

### POST /api/chat/conversaciones
Crea una nueva conversación o retorna la existente.

**Body:**
```json
{
  "otroUsuarioId": "id-del-usuario"
}
```

**Respuesta:**
```json
{
  "success": true,
  "conversacion": {
    "id": "conversacion-uuid",
    "psicologoId": "psicologo-id",
    "pacienteId": "paciente-id"
  }
}
```

### GET /api/chat/mensajes
Obtiene los mensajes de una conversación.

**Query Parameters:**
- `conversacionId` (requerido): UUID de la conversación

**Respuesta:**
```json
{
  "success": true,
  "mensajes": [
    {
      "id": "mensaje-uuid",
      "conversacionId": "conversacion-uuid",
      "remitente": "psicologo",
      "remitenteId": "psicologo-id",
      "contenido": "Hola, ¿cómo te sientes hoy?",
      "leido": true,
      "createdAt": "2025-11-10T10:30:00Z"
    }
  ]
}
```

### POST /api/chat/mensajes
Envía un nuevo mensaje.

**Body:**
```json
{
  "conversacionId": "conversacion-uuid",
  "contenido": "Texto del mensaje aquí"
}
```

**Respuesta:**
```json
{
  "success": true,
  "mensaje": {
    "id": "mensaje-uuid",
    "conversacionId": "conversacion-uuid",
    "remitente": "paciente",
    "remitenteId": "paciente-id",
    "contenido": "Texto del mensaje aquí",
    "leido": false,
    "createdAt": "2025-11-10T10:35:00Z"
  }
}
```

## Integración en la navegación

Se agregó el botón "Chat" en la navegación móvil de ambos roles:

**Para Psicólogos:**
- Archivo: `src/app/inicio/psicologo/page.tsx`
- Ubicación: Barra de navegación inferior (entre Pacientes y Agenda)
- Ruta: `/chat`

**Para Pacientes:**
- Archivo: `src/app/inicio/paciente/page.tsx`
- Ubicación: Barra de navegación inferior (entre botón + y Tareas)
- Ruta: `/chat`

## Cómo usar

### Para el Psicólogo

1. Navega a la sección de Chat desde el menú inferior
2. Verás una lista de todos los pacientes que tienes asignados
3. Haz clic en un paciente para abrir la conversación
4. Escribe un mensaje y presiona enviar
5. Los mensajes se actualizarán automáticamente cada 2 segundos

### Para el Paciente

1. Navega a la sección de Chat desde el menú inferior
2. Verás el chat con tu psicólogo asignado (solo hay una conversación posible)
3. Escribe un mensaje y presiona enviar
4. Los mensajes se actualizarán automáticamente cada 2 segundos

## Medidas de seguridad

✅ **Autenticación JWT:** Todos los endpoints requieren un token JWT válido
✅ **Validación de permisos:** Se verifica que el usuario pertenezca a la conversación
✅ **Restricción de acceso:**
   - Psicólogos solo pueden chatear con sus pacientes asignados
   - Pacientes solo pueden chatear con su psicólogo asignado

## Tecnologías utilizadas

- **Backend:** Next.js 15 (API Routes)
- **ORM:** Prisma
- **Base de datos:** MySQL
- **Autenticación:** JWT (Jose)
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Íconos:** Lucide React

## Próximas mejoras sugeridas

- Implementar WebSockets en lugar de polling para actualizaciones en tiempo real
- Agregar notificaciones de mensajes no leídos
- Implementar typing indicators ("escribiendo...")
- Agregar soporte para archivos/imágenes
- Historial de mensajes paginado
- Búsqueda de conversaciones
- Archivar/desmarcar conversaciones
- Confirmación de entrega de mensajes

## Migración de base de datos

Se ejecutó correctamente:
```bash
npm run db:push
```

Las tablas `Conversaciones` y `Mensajes` fueron creadas exitosamente en MySQL.

