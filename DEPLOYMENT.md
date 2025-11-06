# MiauBloom - Guía de Deployment

## Deployment en Vercel

### Pasos para hacer deploy:

1. **Conectar el repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio `miaubloom`
   - Selecciona la rama `main`

2. **Configurar Variables de Entorno**
   - En el dashboard de Vercel, ve a **Settings > Environment Variables**
   - Agrega las siguientes variables:
   
   ```
   DATABASE_URL = mysql://usuario:contraseña@host:puerto/miaubloom
   JWT_SECRET = (genera con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   NEXTAUTH_URL = https://tu-dominio.vercel.app
   NEXTAUTH_SECRET = (mismo que generes para JWT_SECRET o uno diferente)
   NODE_ENV = production
   ```

3. **Configurar Base de Datos**
   - Asegúrate de que tu base de datos MySQL sea accesible desde internet
   - O usa un servicio como PlanetScale, AWS RDS, o similar
   - **IMPORTANTE**: La URL debe ser accesible desde los servidores de Vercel

4. **Build Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci --legacy-peer-deps`

5. **Hacer Deploy**
   - Haz un push a la rama `main`
   - Vercel automáticamente disparará un build y deploy
   - Monitorea los logs en el dashboard

### Troubleshooting

#### Error: Database connection failed
- Verifica que la URL de MySQL sea correcta
- Asegúrate que tu base de datos permite conexiones remotas
- Comprueba que el usuario/contraseña son correctos

#### Error: Build fails
- Verifica los logs de build en Vercel
- Asegúrate que NODE_ENV=production está configurado
- Revisa que todas las variables de entorno estén presentes

#### Error: Pages not loading
- Verifica que las APIs están siendo llamadas correctamente
- Comprueba los logs del servidor en Vercel
- Revisa la consola del navegador para errores

## Ejecución Local

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Crear archivo .env desde .env.example
cp .env.example .env

# Completar las variables de entorno en .env

# Ejecutar en desarrollo
npm run dev

# Hacer build local
npm run build

# Ejecutar en producción local
npm start
```

## Requisitos

- Node.js 18+
- npm 9+
- MySQL 8+
- Git

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DATABASE_URL | Conexión a MySQL | mysql://user:pass@host:3306/db |
| JWT_SECRET | Secreto para tokens JWT | (string aleatorio de 64 caracteres) |
| NEXTAUTH_URL | URL base de la app | https://app.vercel.app |
| NEXTAUTH_SECRET | Secreto para NextAuth | (string aleatorio de 64 caracteres) |
| NODE_ENV | Ambiente de ejecución | production / development |

## Monitoring y Logs

- **Vercel Logs**: Dashboard > Project > Deployments > Select deployment > Logs
- **Database Logs**: Verifica los logs de tu hosting MySQL
- **Client Console**: Abre DevTools en el navegador (F12)

## Support

Para problemas, revisa:
1. Los logs de Vercel
2. La configuración de variables de entorno
3. La conectividad de la base de datos
4. La documentación de Next.js en https://nextjs.org/docs
