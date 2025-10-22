# 🌸 MiauBloom - Crece y Siente

![Version](https://img.shields.io/badge/version-2.0.0-pink)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.17.1-teal)

> Plataforma de bienestar emocional que conecta pacientes con psicólogos a través de una experiencia interactiva y gamificada.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [PWA - Instalación](#-pwa---instalación-en-dispositivos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Despliegue en Vercel](#-despliegue-en-vercel)

---

## 🚀 Características

- ✅ **Splash Screen animado** con elementos decorativos
- ✅ **Sistema de autenticación** con JWT y cookies seguras
- ✅ **PWA (Progressive Web App)** instalable en dispositivos móviles
- ✅ **Roles de usuario**: Paciente y Psicólogo
- ✅ **Diseño responsive** adaptado a todos los dispositivos
- ✅ **API REST** completa con Next.js 15
- ✅ **Base de datos MySQL** con Prisma ORM

---

## 🛠️ Tecnologías

### Frontend
- **Next.js 15.5.6** - Framework de React
- **React 19.1.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos

### Backend
- **Prisma 6.17.1** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **bcryptjs** - Encriptación de contraseñas
- **Next.js API Routes** - Endpoints del servidor

### PWA
- **next-pwa 5.6.0** - Soporte para Progressive Web Apps
- **Service Workers** - Caché y funcionalidad offline

---

## 📦 Instalación

### Prerrequisitos
```bash
Node.js >= 18.0.0
MySQL >= 8.0
npm o yarn
```

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/miaubloom.git
cd miaubloom
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DATABASE_URL="mysql://usuario:password@localhost:3306/miaubloom"
JWT_SECRET="tu_secreto_super_seguro_aqui"
NODE_ENV="development"
```

4. **Configurar la base de datos**
```bash
# Crear las tablas
npx prisma migrate dev

# Poblar con datos de prueba
npx prisma db seed
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a MySQL | `mysql://root:@localhost:3306/miaubloom` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `miasecret_miaubloom_dev_2025` |
| `NODE_ENV` | Entorno de ejecución | `development` \| `production` |

### Generar JWT Secret seguro
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 PWA - Instalación en Dispositivos

### Configuración PWA

El archivo `next.config.ts` está configurado para generar automáticamente el PWA:

```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', 
  register: true,
  skipWaiting: true,
});
```

### 🔧 **SOLUCIÓN: PWA no se instala en Vercel**

**Problema:** El PWA solo se genera en producción, pero `next-pwa` está deshabilitado en desarrollo.

**Solución:**

1. **Verificar que `manifest.json` esté accesible:**
```bash
# Debe responder en:
https://tu-app.vercel.app/manifest.json
```

2. **Verificar Service Worker:**
```bash
# Debe responder en:
https://tu-app.vercel.app/sw.js
```

3. **Forzar build de producción localmente (para pruebas):**
```bash
NODE_ENV=production npm run build
npm run start
```

4. **En Vercel, asegúrate de:**
   - Variables de entorno configuradas correctamente
   - `NODE_ENV=production` (se configura automáticamente)
   - HTTPS habilitado (requisito para PWA)

### Instalación en dispositivos

#### 📱 **Android (Chrome)**
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

#### 🍎 **iOS (Safari)**
1. Abre la app en Safari
2. Toca el botón de compartir (⎆)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

#### 💻 **Desktop (Chrome/Edge)**
1. Abre la app en el navegador
2. Busca el ícono de instalación en la barra de direcciones
3. Click en "Instalar"

### Verificar instalación PWA

**Desde DevTools (Chrome):**
1. F12 → Application → Manifest
2. Verifica que el manifest se cargue correctamente
3. Application → Service Workers
4. Verifica que el SW esté activado

---

## 📂 Estructura del Proyecto

```
miaubloom/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos de prueba
│   └── migrations/            # Migraciones de BD
├── public/
│   ├── assets/               # Imágenes y recursos
│   ├── icons/                # Iconos PWA
│   ├── manifest.json         # Configuración PWA
│   └── sw.js                 # Service Worker
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/route.ts      # API de login
│   │   │       └── register/route.ts   # API de registro
│   │   ├── auth/
│   │   │   ├── login/page.tsx         # Página de login
│   │   │   └── register/page.tsx      # Página de registro
│   │   ├── identificacion/page.tsx    # Selección de rol
│   │   ├── globals.css                # Estilos globales
│   │   ├── layout.tsx                 # Layout principal
│   │   └── page.tsx                   # Splash screen
│   └── components/           # Componentes reutilizables
├── .env                      # Variables de entorno
├── next.config.ts            # Configuración de Next.js
├── package.json              # Dependencias
├── tailwind.config.ts        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

---

## 🔌 API Endpoints

### Autenticación

#### `POST /api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "Password123",
  "nombreCompleto": "Juan Pérez",
  "rol": "Paciente" | "Psicólogo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "nombreCompleto": "Juan Pérez",
    "rol": "Paciente",
    "perfilCompleto": false
  }
}
```

#### `POST /api/auth/login`
Inicia sesión de usuario.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "Password123",
  "rol": "Paciente" | "Psicólogo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "nombreCompleto": "Juan Pérez",
    "rol": "Paciente",
    "perfilCompleto": true,
    "perfil": { ... }
  }
}
```

#### `GET /api/auth/login`
Verifica si hay una sesión activa.

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "nombreCompleto": "Juan Pérez",
    "rol": "Paciente",
    "perfilCompleto": true
  }
}
```

---

## 🚀 Despliegue en Vercel

### Preparación

1. **Push a GitHub**
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno

3. **Variables de Entorno en Vercel**

En el dashboard de Vercel → Settings → Environment Variables:

```
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=tu_secreto_seguro_aqui
NODE_ENV=production
```

4. **Deploy**
```bash
# Vercel hace deploy automático con cada push
git push origin main

# O manualmente con Vercel CLI
vercel --prod
```

### Verificar PWA en Producción

```bash
# Verificar manifest
curl https://tu-app.vercel.app/manifest.json

# Verificar service worker
curl https://tu-app.vercel.app/sw.js

# Lighthouse audit (PWA score)
npx lighthouse https://tu-app.vercel.app --only-categories=pwa
```

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Base de datos
npx prisma migrate dev      # Crea migración
npx prisma db seed          # Pobla con datos de prueba
npx prisma studio           # Abre GUI de base de datos

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 📝 Credenciales de Prueba

Después de ejecutar `npx prisma db seed`:

### Psicólogos
- **Email:** `dra.gonzalez@miaubloom.com`
- **Password:** `test123`

- **Email:** `dr.martinez@miaubloom.com`
- **Password:** `test123`

### Pacientes
- **Email:** `juan.perez@email.com`
- **Password:** `test123` (perfil completo)

- **Email:** `nuevo.paciente@email.com`
- **Password:** `test123` (sin perfil - para probar flujo)

---

## 🐛 Troubleshooting

### PWA no se instala

**Síntomas:**
- No aparece el botón "Instalar"
- Manifest no se carga
- Service Worker no se registra

**Soluciones:**

1. **Verificar HTTPS**
```bash
# PWA requiere HTTPS (excepto en localhost)
# Vercel proporciona HTTPS automáticamente
```

2. **Verificar manifest.json**
```bash
# Debe estar en /public/manifest.json
# Verificar que sea accesible en /manifest.json
```

3. **Limpiar caché**
```bash
# Chrome DevTools → Application → Clear storage → Clear site data
```

4. **Verificar configuración next-pwa**
```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production', // ← IMPORTANTE
  register: true,
  skipWaiting: true,
});
```

5. **Rebuild en producción**
```bash
rm -rf .next
NODE_ENV=production npm run build
```

---

## 📄 Licencia

© 2025 MiauBloom - Todos los derechos reservados

---

## 👨‍💻 Autor

**Kevin Mariano**  
MiauBloom Development Team

---

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Checklist](https://web.dev/pwa-checklist/)