# Instalación de Clerk para EdutechLife

## Problema Actual
Clerk no se está instalando correctamente debido a problemas de red/npm. El sistema está funcionando en **modo simulación**.

## Solución

### Opción 1: Usar el script de instalación (Recomendado)
```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend
node scripts/install-clerk.js
```

Sigue las instrucciones en pantalla para instalar Clerk.

### Opción 2: Instalación manual
```bash
cd /Users/home/Desktop/edutechlife/edutechlife-frontend

# Limpiar cache de npm
npm cache clean --force

# Instalar Clerk
npm install @clerk/react@6.2.1 @clerk/ui@1.5.0 --no-audit --progress=false

# O usar pnpm (más rápido)
pnpm add @clerk/react @clerk/ui
```

### Opción 3: Instalar globalmente primero
```bash
# Instalar Clerk globalmente para verificar
npm install -g @clerk/cli

# Luego instalar en el proyecto
cd /Users/home/Desktop/edutechlife/edutechlife-frontend
npm install @clerk/react @clerk/ui
```

## Verificación

Después de instalar, verifica que Clerk esté funcionando:

1. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Verifica en la consola del navegador:**
   - Deberías ver: `✓ Clerk está instalado y listo`
   - No deberías ver: `⚠ Clerk no está instalado, usando modo simulación`

3. **Prueba la configuración:**
   - Abre http://localhost:5174 (o el puerto que uses)
   - Revisa la consola para errores
   - Verifica que las variables de entorno se carguen correctamente

## Variables de Entorno

Asegúrate de que tu archivo `.env` tenga:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aW1tZW5zZS1nb3JpbGxhLTYwLmNsZXJrLmFjY291bnRzLmRldiQ
VITE_CLERK_SECRET_KEY=sk_test_GpP4HDMPqZ8nWgcG6MiWNQ4sIOjp9ZiizolK681qjD
```

## Modo Simulación (Actual)

Si no puedes instalar Clerk ahora, el sistema funciona en **modo simulación**:
- ✅ No hay errores en la consola
- ✅ La aplicación funciona normalmente
- ✅ UserDropdownMenu mostrará alertas de "en desarrollo"
- ❌ No hay autenticación real con Clerk

## Solución de Problemas

### Error: "clerkInstance.addListener is not a function"
**Causa:** Clerk no está instalado, usando modo simulación.
**Solución:** Instalar Clerk como se describe arriba.

### Error: "Cannot find module '@clerk/react'"
**Causa:** El paquete no está en node_modules.
**Solución:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Invalid publishable key"
**Causa:** La key de Clerk no es válida o no se carga.
**Solución:** Verifica que la key en `.env` sea correcta y comience con `pk_test_`.

## Próximos Pasos después de Instalar Clerk

1. **Configurar aplicación en dashboard.clerk.com**
2. **Probar autenticación** con sign-in/sign-up
3. **Integrar UserDropdownMenu** con componentes reales de Clerk
4. **Configurar rutas protegidas**

## Contacto

Si los problemas persisten:
1. Verifica tu conexión a internet
2. Prueba con una VPN diferente
3. Contacta a soporte de Clerk: https://clerk.com/support

---

**Estado actual:** ✅ Modo simulación funcionando (sin errores en consola)
**Objetivo:** 🔄 Instalar Clerk para autenticación real