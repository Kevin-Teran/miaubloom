# MiauBloom - Arquitectura del Sistema

## Descripción General

MiauBloom es una Progressive Web App (PWA) diseñada para apoyo psicoterapéutico y seguimiento de datos emocionales en pacientes con depresión. La aplicación facilita la comunicación entre pacientes y psicólogos, el seguimiento emocional diario y la gestión de sesiones terapéuticas.

## Tecnologías Principales

- **Framework**: Next.js 13 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI Components**: shadcn/ui + Radix UI
- **Estilos**: Tailwind CSS
- **Tipografía**: Roboto (según diseño)

## Arquitectura de Base de Datos

### Tablas Principales

#### 1. `perfiles`
Tabla principal de usuarios vinculada a `auth.users`
- Almacena información básica común a todos los roles
- Campos: id, rol, nombre_completo, fecha_nacimiento, género, teléfono, avatar_url, institución

#### 2. `perfiles_paciente`
Información específica de pacientes
- Diagnóstico previo y tiempo desde diagnóstico
- Configuración de avatar personalizado
- Psicólogo asignado
- Preferencias de uso (horario, duración)

#### 3. `perfiles_psicologo`
Información específica de psicólogos
- Licencia profesional y especialidad
- Títulos universitarios
- Capacidad de pacientes (máximo 20 en ámbito pubriprivado)
- Contador de pacientes actuales

#### 4. `emociones_catalogo`
Catálogo de emociones disponibles
- 6 emociones iniciales: Alegría, Tristeza, Frustración, Calma, Ansiedad, Gratitud
- Soporte para realidad aumentada (URLs de modelos 3D y targets)
- Categorización: positiva, negativa, neutra

#### 5. `registros_emocionales`
Registro diario de emociones de pacientes
- Intensidad (escala 1-10)
- Contexto y actividad asociada
- Cuestionario de identificación emocional
- Soporte para registro vía app, AR scan o recordatorio

#### 6. `relacion_paciente_psicologo`
Relación terapéutica entre paciente y psicólogo
- Estado: activa, pausada, finalizada
- Fechas de inicio y fin
- Notas privadas del psicólogo

#### 7. `citas`
Sistema de citas
- Tipos: presencial, virtual, emergencia
- Estados: programada, confirmada, completada, cancelada, no_asistió
- Solicitada por paciente o psicólogo

#### 8. `tareas_terapeuticas`
Tareas asignadas por el psicólogo
- Tipos: diaria, semanal, única
- Prioridad: baja, media, alta
- Seguimiento de completitud

#### 9. `notificaciones`
Sistema de notificaciones
- Tipos: cita, tarea, mensaje, alerta, recordatorio
- Prioridad: normal, alta, crítica

#### 10. `mensajes_chat`
Chat directo paciente-psicólogo
- Mensajes de texto y alertas
- Sistema de lectura

#### 11. `sesiones_terapia`
Registro de sesiones completadas
- Objetivos e intervenciones
- Observaciones del psicólogo
- Plan de acción personalizado

#### 12. `analisis_emocional`
Análisis agregado por período
- Emoción predominante
- Distribución de emociones
- Tendencia: mejorando, estable, empeorando

## Seguridad (Row Level Security)

Todas las tablas tienen RLS habilitado con políticas restrictivas:

### Pacientes
- Pueden ver y editar solo sus propios datos
- Pueden crear registros emocionales
- Pueden ver tareas asignadas

### Psicólogos
- Pueden ver datos de sus pacientes asignados
- Pueden crear y asignar tareas
- Pueden registrar sesiones terapéuticas
- Pueden ver análisis emocionales de sus pacientes

### Admin (Backend)
- Acceso completo (validación en backend)

## Estructura de Rutas

```
/                           - Página principal (selección de rol)
/auth/
  /login                    - Inicio de sesión
  /registro                 - Registro de nuevos usuarios
  /recuperar                - Recuperación de contraseña

/onboarding/
  /paciente                 - Onboarding para pacientes (3 pantallas)
  /psicologo                - Onboarding para psicólogos (3 pantallas)

/dashboard/paciente/
  /                         - Dashboard principal del paciente
  /registrar                - Registrar nueva emoción
  /calendario               - Calendario emocional del mes
  /tareas                   - Lista de tareas asignadas
  /citas                    - Gestión de citas
  /chat                     - Chat con psicólogo
  /perfil                   - Perfil y avatar personalizado
  /configuracion            - Ajustes de la app

/dashboard/psicologo/
  /                         - Dashboard principal del psicólogo
  /pacientes                - Lista de pacientes
  /pacientes/[id]           - Detalle de paciente individual
  /citas                    - Gestión de citas
  /chat                     - Mensajería con pacientes
  /notificaciones           - Alertas y notificaciones
  /configuracion            - Ajustes de la app
```

## Componentes Reutilizables

### UI Components (shadcn/ui)
- Button, Card, Input, Label, Badge
- Dialog, Sheet, Tabs, Calendar
- Toast, Alert, Progress
- Form components con validación

### Componentes Personalizados

#### `AuthProvider`
Context provider para autenticación
- Gestión de sesión de usuario
- Información de perfil
- Métodos de autenticación

#### `RoleSelection`
Pantalla de selección de rol inicial
- Diseño basado en página 6 del PDF
- Transición a registro según rol seleccionado

## Paleta de Colores

Según el documento de diseño (página 19):
- **Principal**: `#F2C2C1` (rosa suave)
- **Negro**: `#070806`
- **Gris**: `#B6BABE`

### Emociones
- **Alegría**: `#FFD700` (dorado)
- **Tristeza**: `#4A90E2` (azul)
- **Frustración**: `#E74C3C` (rojo)
- **Calma**: `#2ECC71` (verde)
- **Ansiedad**: `#F39C12` (naranja)
- **Gratitud**: `#9B59B6` (morado)

## Sistema de Rejilla

Según página 20 del PDF:
- **Columnas**: 4
- **Margen**: 16px
- **Separación**: 8px

## Tipografía

- **Fuente**: Roboto (Regular, Medium, Semibold, Bold)
- **Heading 1**: 20px Bold
- **Heading 2**: 18px Semi Bold
- **Text Body 1**: 16px Medium
- **Text Body 2**: 14px Regular

## Funcionalidades Clave

### Para Pacientes
1. **Registro Emocional Diario**
   - Escaneo de tarjetas con realidad aumentada
   - Cuestionario contextual
   - Visualización en jardín 3D

2. **Calendario Emocional**
   - Vista mensual tipo jardín
   - Detalles por día
   - Gráficas de distribución

3. **Tareas Terapéuticas**
   - Asignadas por el psicólogo
   - Seguimiento de completitud
   - Reflexiones del paciente

4. **Comunicación**
   - Chat directo con psicólogo
   - Sistema de alertas automáticas
   - Notificaciones importantes

5. **Avatar Personalizable**
   - Selección de ropa y accesorios
   - Nickname personalizado
   - Integración con el jardín

### Para Psicólogos
1. **Gestión de Pacientes**
   - Lista de hasta 20 pacientes
   - Estado emocional actual
   - Alertas críticas

2. **Análisis de Datos**
   - Historial de registros emocionales
   - Gráficas y tendencias
   - Emoción predominante

3. **Sesiones Terapéuticas**
   - Registro de sesiones
   - Objetivos e intervenciones
   - Plan de acción personalizado

4. **Asignación de Tareas**
   - Crear tareas personalizadas
   - Seguimiento de completitud
   - Feedback del paciente

5. **Comunicación**
   - Chat directo con cada paciente
   - Notificaciones de alertas
   - Contactos de emergencia

## PWA (Progressive Web App)

### Manifest
- Nombre: "MiauBloom - Crece y Siente"
- Display: standalone (apariencia de app nativa)
- Theme color: `#F2C2C1`
- Íconos: 192x192 y 512x512

### Características PWA
- Instalable en dispositivos móviles
- Funciona offline (caché de recursos estáticos)
- Notificaciones push (futuro)
- Acceso a cámara para AR scanning

## Consideraciones de Seguridad

1. **Autenticación**
   - Email/password por defecto
   - Soporte para OAuth (Google) opcional
   - Tokens JWT con refresh automático

2. **Autorización**
   - RLS en todas las tablas
   - Políticas restrictivas por rol
   - Validación en backend para admin

3. **Privacidad**
   - Datos médicos encriptados
   - HIPAA compliance considerations
   - Consentimiento informado

4. **Comunicación**
   - HTTPS obligatorio
   - WebSocket seguro para chat
   - Validación de entrada

## Escalabilidad

### Actual
- Supabase free tier: 500MB database, 2GB bandwidth
- Vercel deployment: Edge functions
- Límite: ~1000 usuarios activos

### Futuro
- Migración a Supabase Pro
- CDN para recursos estáticos
- Caché Redis para sesiones
- Microservicios para analytics

## Estado Actual del Proyecto

### Implementado ✅
- ✅ Base de datos completa con RLS
- ✅ Sistema de autenticación
- ✅ Página de selección de rol
- ✅ Registro y login
- ✅ Dashboard paciente (básico)
- ✅ Dashboard psicólogo (básico)
- ✅ PWA manifest
- ✅ Diseño responsivo
- ✅ Estructura modular

### Pendiente 🚧
- 🚧 Onboarding completo (3 pantallas por rol)
- 🚧 Registro de emociones con cuestionario
- 🚧 Calendario emocional interactivo
- 🚧 Sistema de chat en tiempo real
- 🚧 Gestión completa de citas
- 🚧 Perfil personalizable con avatar
- 🚧 Realidad aumentada para escaneo
- 🚧 Análisis y gráficas emocionales
- 🚧 Sistema de notificaciones push
- 🚧 Service Worker para offline
- 🚧 Panel de admin (backend)

## Próximos Pasos Sugeridos

1. **Implementar Onboarding Completo**
   - 3 pantallas para pacientes
   - 3 pantallas para psicólogos
   - Recolección de información inicial

2. **Sistema de Registro Emocional**
   - Formulario con cuestionario contextual
   - Integración con catálogo de emociones
   - Guardado en base de datos

3. **Calendario Emocional**
   - Vista de calendario mensual
   - Representación visual de emociones
   - Detalles por día con gráficas

4. **Chat en Tiempo Real**
   - Supabase Realtime para mensajería
   - Indicadores de lectura
   - Sistema de alertas

5. **Realidad Aumentada (AR)**
   - Integración con biblioteca AR (AR.js o 8th Wall)
   - Targets imprimibles
   - Modelos 3D de emociones

## Notas de Desarrollo

### JSDoc
Todos los archivos deben incluir:
```typescript
/**
 * @file nombre-archivo.tsx
 * @route ruta/completa/archivo.tsx
 * @description Descripción detallada en español
 * @author Kevin Mariano
 * @version 2.0.5
 * @since 1.0.0
 * @copyright MiauBloom
 */
```

### Control de Versiones
- Versión actual: 2.0.5
- Formato: MAYOR.MENOR.PARCHE
- Commits descriptivos en español
- Branches: main, develop, feature/*

### Testing (Futuro)
- Jest para pruebas unitarias
- React Testing Library para componentes
- Playwright para E2E
- Supabase Test Helpers para DB

---

**Última actualización**: 2025-10-07
**Desarrollador**: Kevin Mariano
**Cliente**: Luana Marcela Bulla López
