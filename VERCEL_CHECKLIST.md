# ✅ CHECKLIST DE DEPLOYMENT EN VERCEL

## Paso 1: Verificar Build Local ✓
- [x] Build local exitoso: `npm run build` 
- [x] Sin errores de compilación
- [x] 48/48 rutas generadas correctamente
- [x] Size: 109 kB (First Load JS)

## Paso 2: Configurar en Vercel Dashboard
- [ ] Importar proyecto desde GitHub
- [ ] Seleccionar rama: `main`
- [ ] Framework preset: **Next.js**
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm ci --legacy-peer-deps`

## Paso 3: Variables de Entorno (CRÍTICO)
En **Settings > Environment Variables**, agregar:

- [ ] `DATABASE_URL` = `mysql://usuario:contraseña@host:puerto/miaubloom`
  - ⚠️ La BD debe ser accesible desde internet
  - ⚠️ Verifica credenciales

- [ ] `JWT_SECRET` = (generar con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - ⚠️ Debe ser único y seguro
  - ⚠️ NUNCA usar el mismo que en desarrollo

- [ ] `NEXTAUTH_URL` = `https://tu-dominio-vercel.vercel.app`
  - ⚠️ Reemplazar con tu URL real de Vercel

- [ ] `NEXTAUTH_SECRET` = (generar con script anterior)
  - ⚠️ Puede ser igual o diferente a JWT_SECRET

- [ ] `NODE_ENV` = `production`

## Paso 4: Verificar Base de Datos
- [ ] MySQL accesible desde internet
- [ ] Firewall permite conexiones desde Vercel
- [ ] Credenciales correctas (usuario/contraseña)
- [ ] Base de datos `miaubloom` existe
- [ ] Migraciones aplicadas

## Paso 5: Deploy Inicial
- [ ] Hacer push a rama `main`
- [ ] Vercel automáticamente dispara build
- [ ] Monitorear logs en Vercel dashboard
- [ ] Esperar a que compile y deplogue

## Paso 6: Verificación Post-Deploy
- [ ] Visitar la URL de Vercel
- [ ] Verificar que las páginas cargan
- [ ] Revisar logs de error en consola (F12)
- [ ] Probar login
- [ ] Probar un flujo básico (cargar datos)

## Troubleshooting

### Si falla el build:
1. Revisar **Deployments > Logs**
2. Verificar que todas las variables de entorno están presentes
3. Confirmar que Node modules instala correctamente

### Si falla en runtime (error 500):
1. Revisar **Deployments > Logs** del servidor
2. Verificar que DATABASE_URL es correcto
3. Confirmar que BD es accesible
4. Revisar consola del navegador (F12)

### Si la BD no conecta:
1. Verificar URL de conexión en `.env` de Vercel
2. Confirmar que BD permite conexiones remotas
3. Revisar firewall/security groups
4. Probar conexión local con misma URL

## Contacto de Soporte

Si necesitas ayuda:
1. Revisa DEPLOYMENT.md en el repo
2. Verifica los logs de Vercel
3. Comprueba la conectividad de la BD
4. Consulta la documentación de Next.js

---
**Última actualización:** 6 de noviembre de 2025
