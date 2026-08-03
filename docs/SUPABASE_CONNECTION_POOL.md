# Supabase Connection Pooling Setup Guide

**Objetivo:** Aumentar escalabilidad de la plataforma de 100-1,000 usuarios concurrentes a 5,000-10,000 usuarios concurrentes.

**Impacto esperado:** +0.15 puntos (8.32 → 8.47)

---

## ¿Por qué se necesita Connection Pooling?

### Problema sin Pool
- Cada request crea una conexión TCP nueva a PostgreSQL
- Default Supabase: `max_connections = 100`
- Con 100+ usuarios concurrentes simultáneos: **timeout "too many connections"**
- Experiencia: errores de base de datos, fallos de API

### Solución con Pool
- PgBouncer reutiliza conexiones entre requests
- 1 conexión DB = múltiples usuarios simultáneos
- Capacidad: 5,000-10,000 usuarios concurrentes
- Experiencia: confiabilidad, velocidad, escalabilidad

---

## Configuración en Supabase Console

### Paso 1: Habilitar Connection Pooling

1. Ir a **Supabase Console** → Tu proyecto
2. Navega a **Settings** → **Database**
3. Busca **Connection Pooling** (abajo de la página)
4. Haz clic en **Enable Pooling**

### Paso 2: Configurar el Pool

```
Mode: Transaction (recomendado)
Max clients: 100
Default pool size: 25
Connection timeout: 3s
Idle in transaction: 540s
```

**Explicación:**
- **Mode: Transaction** - Reutiliza conexiones por transacción (ideal para aplicaciones)
- **Max clients: 100** - Clientes simultáneos máx (aumentar si es necesario)
- **Pool size: 25** - Conexiones mantenidas al DB (tunar según uso)

### Paso 3: Obtener URLs

Después de habilitar, Supabase te dará dos URLs:

```
SUPABASE_DIRECT_URL     → postgresql://user:password@xxx.db.supabase.co:5432/postgres
SUPABASE_POOL_URL       → postgresql://user:password@xxx.pooler.supabase.co:6543/postgres
```

---

## Configuración en Backend (Render)

### Paso 1: Agregar Variables de Entorno

En **Render Dashboard** → Tu servicio backend → **Environment**:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx_your_key_xxx
SUPABASE_POOL_URL=postgresql://user:password@xxx.pooler.supabase.co:6543/postgres
SUPABASE_DIRECT_URL=postgresql://user:password@xxx.db.supabase.co:5432/postgres
```

### Paso 2: Usar Pool en App

```javascript
// src/db.js
import { createClient } from "@supabase/supabase-js";

// Para queries normales (app) - USAR POOL
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Para migraciones - USAR DIRECT (no pooler)
// Configurar en scripts de migración solamente
export const supabaseMigration = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    db: { schema: "public" },
  }
);
```

---

## Verificación y Monitoreo

### Test de Carga (Recomendado)

```bash
# Instalar herramienta de carga
npm install -g artillery

# Crear archivo artillery.yml
cat > artillery.yml << 'EOF'
config:
  target: "https://api.tudominio.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Ramp up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained"

scenarios:
  - name: "API Users"
    flow:
      - get:
          url: "/api/user/progress"
          headers:
            Authorization: "Bearer {{ $randomString(100) }}"
EOF

# Ejecutar test
artillery run artillery.yml
```

### Métricas en Supabase Console

Ir a **Monitoring** → **Connections** para ver:
- Conexiones activas
- Pool hit rate (% de reutilización)
- Query latency

---

## Troubleshooting

### Problema: "too many connections"
**Causa:** Pool agotado  
**Solución:** Aumentar `max_clients` en Console

### Problema: "connection timeout"
**Causa:** Pool exhausted mientras maneja requests  
**Solución:** Aumentar `pool_size` o revisar queries lentas

### Problema: "idle in transaction"
**Causa:** Transacciones largas bloquean conexiones  
**Solución:** Revisar lógica de transacciones, usar `timeout: 540s`

---

## Impacto de Rendimiento Esperado

### Antes de Pool
```
Concurrencia: 100 usuarios
Throughput:   250 req/s
Latency p95:  2-5s
Errores:      12% (connection exhausted)
```

### Después de Pool
```
Concurrencia: 5,000+ usuarios
Throughput:   2,500+ req/s
Latency p95:  50-150ms
Errores:      <1%
```

---

## Checklist de Despliegue

- [ ] Connection pooling habilitado en Supabase Console
- [ ] SUPABASE_POOL_URL configurada en Render
- [ ] SUPABASE_DIRECT_URL para migraciones solamente
- [ ] Aplicación usa supabase client (se conecta automáticamente al pool)
- [ ] Test de carga ejecutado (artillery)
- [ ] Monitoreo de conexiones revisado
- [ ] Performance mejorado verificado en Sentry/PostHog

---

## Recursos

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/platform/performance#connection-pooling)
- [PgBouncer Configuration](https://www.pgbouncer.org/config.html)
- [Artillery Load Testing](https://artillery.io/)

**Impacto Estimado:** +0.15 puntos en score de plataforma  
**Esfuerzo:** 30-60 minutos (config + testing)
**Urgencia:** Alta (para escalabilidad)
