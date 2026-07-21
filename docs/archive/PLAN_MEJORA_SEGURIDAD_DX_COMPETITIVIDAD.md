# Plan Integral de Mejora: Seguridad, DX y Competitividad

> Basado en auditoría iALab Dashboard — Junio 2026
> Scores actuales: Seguridad 5.5 | DX 6.5 | Competitividad 6.0 | Global 6.9
> Scores objetivo: Seguridad 8.0 | DX 8.0 | Competitividad 7.5 | Global 7.8

---

## Tabla de Contenidos
1. [Fase S1: Seguridad — Remediación Crítica](#fase-s1-seguridad--remediación-crítica)
2. [Fase S2: Seguridad — Fortalecimiento Estructural](#fase-s2-seguridad--fortalecimiento-estructural)
3. [Fase D1: Developer Experience — TypeScript Migration](#fase-d1-developer-experience--typescript-migration)
4. [Fase D2: Developer Experience — Testing & CI](#fase-d2-developer-experience--testing--ci)
5. [Fase D3: Developer Experience — Tooling & Documentation](#fase-d3-developer-experience--tooling--documentation)
6. [Fase C1: Competitividad — Push Notifications](#fase-c1-competitividad--push-notifications)
7. [Fase C2: Competitividad — Social Leaderboard](#fase-c2-competitividad--social-leaderboard)
8. [Fase C3: Competitividad — Mobile App](#fase-c3-competitividad--mobile-app)
9. [Priorización y Roadmap](#priorización-y-roadmap)

---

# Fase S1: Seguridad — Remediación Crítica

> Objetivo: Eliminar vulnerabilidades activas. Score target: 7.0
> Esfuerzo: 3 días | Impacto: 🔴 Alto | Dependencias: Acceso a dashboards (Clerk, Supabase, Google Cloud)

## S1.1 Rotar API keys comprometidas

**Problema**: Google TTS API key expuesta en `.env` y `.env.local` que están COMMITHEADOS en git. Visible en `src/utils/speech.js:228` como query param en URL.

**Solución**:
1. Rotar la Google TTS API key desde Google Cloud Console
2. Rotar Supabase anon key (precaución: afecta clientes en producción)
3. Eliminar `.env` y `.env.local` del tracking de git:
   ```bash
   git rm --cached .env .env.local
   ```
4. Agregar a `.gitignore` si no están ya
5. Regenerar las claves en los dashboards respectivos

**Archivos a modificar**:
- `.gitignore` — verificar que `.env` y `.env.local` están incluidos
- `src/lib/supabase.js` — eliminar fallback hardcodeado (líneas 6-7)
- `index.html` — eliminar fallback de Clerk publishable key o mover a env

## S1.2 Reemplazar dangerouslySetInnerHTML con DOMPurify

**Problema**: 3 usos de `dangerouslySetInnerHTML` sin sanitización (GlobalSearchBar.jsx x2, AIPanel.jsx x1). Permite XSS.

**Solución**:
1. Instalar `DOMPurify`: `npm install dompurify`
2. Crear helper `src/utils/sanitize.js`:
   ```js
   import DOMPurify from 'dompurify';
   export const sanitize = (html) => DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'], ALLOWED_ATTR: ['href', 'target', 'rel', 'class'] });
   ```
3. Envolver cada `dangerouslySetInnerHTML={{ __html: ... }}` con `sanitize()`

**Archivos a modificar**:
- `src/components/IALab/GlobalSearchBar.jsx` (líneas 209, 231)
- `src/components/AIPanel.jsx` (línea 262)
- `src/lib/forumService.js` — revisar si hay rendering de HTML sin sanitizar

## S1.3 Fix RLS policies — `current_user` → `auth.uid()`

**Problema CRÍTICO**: Las políticas RLS en `003_forum_premium.sql` usan `current_user` (que retorna el rol de Postgres, ej. `authenticated`, `anon`, `service_role`) en vez de `auth.uid()` (que retorna el ID del usuario autenticado). Esto significa que **cualquier usuario autenticado puede insertar/modificar datos de cualquier otro usuario** porque la comparación `user_id = current_user` nunca va a coincidir con un UUID de Clerk.

**Ejemplo roto**:
```sql
CREATE POLICY "comments_insert_own" ON forum_comments FOR INSERT WITH CHECK (user_id = current_user);
-- current_user = 'authenticated' (rol), nunca igual a user_id = 'user_2abc123'
```

**Solución**: Reemplazar `current_user` por `auth.uid()` en todas las políticas de ownership:
- `forum_comments`: `user_id = auth.uid()`
- `forum_bookmarks`: `user_id = auth.uid()`
- `forum_notifications`: `user_id = auth.uid()`
- `forum_profiles`: `user_id = auth.uid()`

También verificar que las políticas de las tablas `profiles` y `forum_posts` existentes usen `auth.uid()`.

**Archivos a modificar**:
- `supabase/migrations/003_forum_premium.sql` (líneas 194, 195, 199, 200, 201, 202, 204)
- Cualquier otra migración que tenga políticas RLS

## S1.4 Agregar CSP en index.html como fallback local

**Problema**: CSP solo existe en `vercel.json`. En desarrollo local no hay protección CSP.

**Solución**: Agregar `<meta>` tag CSP en `index.html` como fallback para desarrollo:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co http://localhost:* https://api.deepseek.com https://clerk.accounts.dev; frame-src 'self' https://clerk.accounts.dev; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'">
```

**Archivos a modificar**:
- `public/index.html`

---

# Fase S2: Seguridad — Fortalecimiento Estructural

> Objetivo: Arquitectura de defensa en profundidad. Score target: 8.0
> Esfuerzo: 5 días | Impacto: 🔴 Alto

## S2.1 Backend: Agregar autenticación JWT de Clerk

**Problema**: Los 15 endpoints del backend Express son completamente públicos. Cualquiera que descubra la URL puede consumir DeepSeek API sin restricción, incurriendo en costos.

**Solución**:
1. Instalar `@clerk/express`: `npm install @clerk/express`
2. Agregar middleware de verificación JWT en el backend:

```js
import { clerkMiddleware, requireAuth } from '@clerk/express';

app.use(clerkMiddleware());

// Endpoints públicos (health check, voice token)
app.get('/api/health', (req, res) => { ... });

// Endpoints protegidos
app.post('/api/chat', requireAuth(), async (req, res) => { ... });
app.post('/api/ialab/prompts', requireAuth(), async (req, res) => { ... });
// ... aplicar a todos los endpoints excepto health
```

3. Agregar `CLERK_SECRET_KEY` al `.env` del backend
4. Actualizar `vercel.json` del backend si aplica

**Alternativa (más simple)**: Validar JWT manualmente:
```js
import { createRemoteJWKSet, jwtVerify } from 'jose';
const JWKS = createRemoteJWKSet(new URL('https://clerk.accounts.dev/.well-known/jwks.json'));

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
```

**Archivos a modificar**:
- `edutechlife-backend/package.json`
- `edutechlife-backend/server.js`
- `edutechlife-backend/.env.example`

## S2.2 Backend: Centralizar error handling

**Problema**: No hay middleware de error centralizado. `error.message` se filtra al cliente. Errores CORS devuelven HTML 500.

**Solución**:
```js
// Error middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack);
  
  if (err.message.startsWith('Origen no permitido')) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  
  res.status(err.status || 500).json({ 
    error: 'Error interno del servidor',
    requestId: req.headers['x-request-id'] || null,
  });
});
```

## S2.3 Backend: Refactorizar a estructura modular

**Problema**: `server.js` tiene 1000 líneas sin separación de concerns.

**Solución**: Dividir en:
```
edutechlife-backend/
├── src/
│   ├── index.js              # Entry point (~30 líneas)
│   ├── app.js                # Express setup + middleware (~50 líneas)
│   ├── middleware/
│   │   ├── auth.js           # Clerk JWT verification
│   │   ├── sanitize.js       # Input sanitization
│   │   ├── errorHandler.js   # Centralized error handling
│   │   └── rateLimiter.js    # Rate limit configs
│   ├── routes/
│   │   ├── chat.js           # /api/chat endpoints
│   │   ├── ialab.js          # /api/ialab/* endpoints
│   │   ├── voice.js          # /api/voice-token
│   │   └── health.js         # /api/health
│   ├── services/
│   │   ├── deepseek.js       # DeepSeek API client
│   │   └── googleTts.js      # Google TTS auth + client
│   ├── utils/
│   │   └── sanitize.js       # XSS sanitization
│   └── data/
│       └── modules.js        # Module content data
├── .env.example
├── package.json
└── vercel.json
```

## S2.4 Remover fallbacks de API keys en frontend

**Problema**: `src/lib/supabase.js` tiene fallbacks hardcodeados con claves reales (líneas 6-7). `index.html` tiene Clerk publishable key hardcodeado.

**Solución**:
- En `supabase.js`: reemplazar fallbacks con strings vacías y validación estricta
- En `index.html`: cargar Clerk JS dinámicamente desde `main.jsx` o usar `VITE_CLERK_PUBLISHABLE_KEY`
- En `env.js`: validar que las claves requeridas estén presentes, no solo loguear warning

---

# Fase D1: Developer Experience — TypeScript Migration

> Objetivo: Migración progresiva a TypeScript. Score target: 7.5
> Esfuerzo: 10 días | Impacto: 🔴 Alto

## D1.1 Preparación (Día 1)

1. Actualizar `tsconfig.json` → `strict: true` y `noImplicitAny: true`
2. Configurar `tsc --noEmit` en pre-commit hook
3. Crear `src/types/` con tipos base:

```typescript
// src/types/ialab.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin' | 'smartboard';
}

export interface Module {
  id: number;
  title: string;
  objective: string;
  description: string;
  // ...
}

export interface Progress {
  userId: string;
  moduleId: number;
  completed: boolean;
  score: number;
  // ...
}
```

## D1.2 Migración por capas (Días 2-6)

Orden recomendado (menor riesgo → mayor impacto):

| Día | Capa | Archivos | Estrategia |
|-----|------|----------|------------|
| 2 | **Constants + Types** | `src/constants/*`, `src/types/*` | Renombrar a `.ts` |
| 3 | **Store (Zustand)** | `src/store/**/*.js` | Migrar slices, mantener `any` en persist |
| 4 | **Services** | `src/services/*.js` | Tipar funciones, responses |
| 5-6 | **Hooks principales** | `src/hooks/IALab/*.js` | Migrar hooks + TanStack Query types |

## D1.3 Estrategia de migración

Usar **migración progresiva** (no reescritura):
- Renombrar archivos `.js` → `.ts`/`.tsx` uno por uno
- Usar `@ts-check` en archivos JS antes de migrar
- Mantener `allowJs: true` durante toda la migración
- Agregar tipos gradualmente sin rompar funcionalidad
- NO migrar componentes de UI (primero capas lógicas)

---

# Fase D2: Developer Experience — Testing & CI

> Objetivo: Tests ejecutables con cobertura significativa. Score target: 8.0
> Esfuerzo: 5 días | Impacto: 🟡 Medio

## D2.1 Fix `ChildProcess.kill` error en tests

**Problema**: `vitest run` falla con `ChildProcess.kill`. Es el bloqueador #1 de DX.

**Solución**:
1. Diagnosticar: verificar si es proceso de Vitest 4 o dependencia conflictiva
2. Probar downgrade/upgrade de vitest
3. Alternativa: migrar a `vitest` v3 si v4 tiene bug conocido
4. Crear script `test:smoke` que corre solo los tests que funcionan

## D2.2 Agregar tests unitarios para módulos críticos

Prioridad alta (sin funcionalidad):
- `src/utils/inputValidator.js` — validación de inputs
- `src/services/deepseek.js` — llamadas API con mocks
- `src/store/slices/gamificationSlice.js` — lógica de XP/streaks
- `src/utils/progressCalculations.js` — cálculos de progreso

## D2.3 Agregar tests de seguridad

- Test que verifica que `sanitize()` remueve `<script>` tags
- Test que verifica que CSP meta tag está presente
- Test que verifica que API keys no están hardcodeadas

## D2.4 CI/CD improvements

- Agregar `npm run test:coverage` al workflow de CI
- Configurar Codecov o cobertura visual
- Agregar `security-audit` job con `npm audit`
- Agregar `typecheck` job separado de lint

---

# Fase D3: Developer Experience — Tooling & Documentation

> Objetivo: Mejorar herramientas y documentación para devs. Score target: 8.0
> Esfuerzo: 4 días | Impacto: 🟡 Medio

## D3.1 ESLint cleanup

**Problema**: 2300 errores de ESLint.

**Solución**:
1. Priorizar errores `no-undef` y `react-hooks/rules-of-hooks` (los más críticos)
2. Configurar ESLint para modo warn-only en reglas no críticas
3. Agregar `eslint-plugin-security` para detectar `dangerouslySetInnerHTML`
4. Agregar `eslint-plugin-xss` para prevenir XSS

## D3.2 Husky + lint-staged optimization

**Problema**: Pre-commit hooks pueden ser lentos.

**Solución**:
```json
// lint-staged config
{
  "src/**/*.{js,jsx}": ["eslint --fix", "prettier --write"],
  "src/**/*.css": ["prettier --write"]
}
```

## D3.3 VSCode workspace config

Crear `.vscode/settings.json` con:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## D3.4 Documentación

- Agregar JSDoc a funciones públicas de store y hooks
- Documentar patrones de seguridad en `CONTRIBUTING.md`
- Crear `docs/SECURITY.md` con políticas de seguridad

---

# Fase C1: Competitividad — Push Notifications

> Objetivo: Push notifications reales (no solo browser). Score target: 6.5
> Esfuerzo: 4 días | Impacto: 🔴 Alto | Dependencias: Supabase + Service Worker

## C1.1 Implementar Push API con VAPID

**Problema**: Las notificaciones actuales (`useBrowserNotifications.js`) solo funcionan con la app abierta. No hay push notifications cuando el usuario cierra el navegador.

**Solución**:
1. Generar claves VAPID (Voluntary Application Server Identification)
2. Configurar service worker para recibir push events:

```js
// public/sw.js (o via vite-plugin-pwa)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: '/badge.png',
    data: { url: data.url || '/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  clients.openWindow(event.notification.data.url);
});
```

3. Crear hook `usePushSubscription.js`:
   - Registra subscription en Supabase (`push_subscriptions` table)
   - Maneja suscripción/desuscripción
   - Sincroniza con el servidor

4. Agregar tabla `push_subscriptions` en Supabase:
```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id),
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own" ON push_subscriptions
  FOR ALL USING (user_id = auth.uid());
```

## C1.2 Backend: Agregar endpoint de push

```js
// POST /api/push/send
app.post('/api/push/send', requireAuth(), async (req, res) => {
  const { userId, title, body, data } = req.body;
  const subscription = await getSubscription(userId);
  if (!subscription) return res.status(404).json({ error: 'No subscription' });
  
  await webpush.sendNotification(subscription, JSON.stringify({
    title, body, icon: '/favicon.ico', url: data?.url || '/ialab'
  }));
  
  res.json({ success: true });
});
```

---

# Fase C2: Competitividad — Social Leaderboard

> Objetivo: Leaderboard multi-usuario con rankings semanales. Score target: 7.0
> Esfuerzo: 5 días | Impacto: 🟡 Medio

## C2.1 Backend: API de leaderboard

```sql
-- Supabase: Tabla de rankings de liga
CREATE TABLE league_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id),
  league_tier TEXT NOT NULL CHECK (league_tier IN ('bronze', 'silver', 'gold', 'diamond')),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE league_rankings ENABLE ROW LEVEL SECURITY;
-- Todos pueden ver rankings
CREATE POLICY "read_all" ON league_rankings FOR SELECT USING (true);
```

## C2.2 Frontend: Leaderboard multi-usuario

1. Ampliar `LeaderboardModal.jsx` existente:
   - Pestaña "Global" con ranking de todos los usuarios en la misma liga
   - Pestaña "Amigos" (si hay sistema de amigos)
   - Pestaña "Mi Liga" (tu grupo semanal)

2. Hook `useSocialLeaderboard.js`:
   ```js
   export function useSocialLeaderboard(tier) {
     return useQuery({
       queryKey: ['league-rankings', tier],
       queryFn: () => supabase
         .from('league_rankings')
         .select('*, profiles(full_name, avatar_url)')
         .eq('league_tier', tier)
         .order('xp_earned', { ascending: false })
         .limit(50),
       staleTime: 5 * 60 * 1000,
     });
   }
   ```

3. Componentes:
   - `LeaderboardTable.jsx` — tabla de posiciones con avatar, nombre, XP, racha
   - `LeaderboardFilters.jsx` — filtro por liga/semana
   - `LeaderboardRewards.jsx` — premios por posición

## C2.3 Sincronización semanal

- Edge Function de Supabase o cron job en backend que calcula rankings cada lunes
- Trigger que actualiza `league_rankings` al finalizar la semana
- Notificación push a los top 3

---

# Fase C3: Competitividad — Mobile App

> Objetivo: App móvil con React Native + Expo. Score target: 7.5
> Esfuerzo: 6-8 semanas | Impacto: 🔴 Alto | Dependencias: API existente

Esta fase es la más grande y debe planificarse como proyecto separado. Aquí el plan de alto nivel:

## C3.1 Setup inicial (Semana 1)
- `npx create-expo-app@latest edutechlife-mobile`
- Configurar Clerk Auth con Expo
- Configurar TanStack Query
- Configurar navegación (Expo Router)
- Reutilizar i18n (487 keys existentes)

## C3.2 Core features (Semanas 2-3)
- Dashboard con XP/streaks/level
- Módulos de aprendizaje (read-only)
- Foro de comunidad
- Quiz interactivo

## C3.3 Gamificación (Semanas 4-5)
- Avatar customization (reutilizar lógica de store)
- Badges y logros
- Leaderboard social
- Notificaciones push nativas

## C3.4 AI Features (Semana 6)
- DeepSeek chat ( API calls)
- Valentina voice agent (TTS)
- Synthesizer de prompts

## C3.5 Offline & Polish (Semanas 7-8)
- Offline-first con SQLite (expo-sqlite)
- Sincronización con Supabase cuando hay conexión
- Animaciones nativas (Reanimated)
- Publicación en App Store + Google Play

---

# Priorización y Roadmap

## Matriz Impacto vs Esfuerzo

```
                    Esfuerzo
              Bajo        Medio        Alto
Impacto  ┌──────────────────────────────────────┐
  Alto   │ S1.1, S1.2   │ C1 Push    │ D1 TS     │
         │ S1.3, S1.4   │ S2.1       │ C3 Mobile  │
         │ S2.4         │ S2.2, S2.3 │           │
  Medio  │ D3.1 ESLint  │ D2 Tests   │ C2 Leader  │
         │ D3.2 Husky   │ D3.4 Docs  │           │
  Bajo   │ D3.3 VSCode  │            │           │
         └──────────────┴────────────┴──────────────┘
```

## Roadmap por sprint

### Sprint 1 (Semana 1) — Seguridad Crítica
| Tarea | Días | Dependencias |
|-------|------|-------------|
| S1.1 Rotar API keys comprometidas | 0.5 | Acceso a dashboards |
| S1.2 DOMPurify + sanitize | 0.5 | — |
| S1.3 Fix RLS policies | 0.5 | Acceso a Supabase |
| S1.4 CSP meta tag | 0.5 | — |
| S2.4 Remover fallbacks | 0.5 | S1.1 |
| D3.1 ESLint cleanup | 1 | — |
| D2.1 Fix ChildProcess.kill | 1 | — |

**Score esperado post-Sprint 1**: Seguridad 5.5→7.0, DX 6.5→7.0

### Sprint 2 (Semana 2) — Backend + Testing
| Tarea | Días | Dependencias |
|-------|------|-------------|
| S2.1 Backend auth (Clerk JWT) | 2 | Acceso a Clerk |
| S2.2 Error handler centralizado | 0.5 | — |
| S2.3 Refactor backend modular | 1.5 | S2.1, S2.2 |
| D2.2 Tests unitarios críticos | 1 | D2.1 |

**Score esperado post-Sprint 2**: Seguridad 7.0→8.0, DX 7.0→7.5

### Sprint 3 (Semanas 3-4) — TypeScript
| Tarea | Días | Dependencias |
|-------|------|-------------|
| D1.1 Preparación TS | 1 | — |
| D1.2 Migrar constants + types | 0.5 | D1.1 |
| D1.2 Migrar store slices | 1.5 | D1.1 |
| D1.2 Migrar services | 1 | D1.1 |
| D1.2 Migrar hooks principales | 2 | D1.1 |
| D3.4 Documentación | 0.5 | — |

**Score esperado post-Sprint 3**: DX 7.5→8.0

### Sprint 4 (Semanas 5-6) — Push + Leaderboard
| Tarea | Días | Dependencias |
|-------|------|-------------|
| C1.1 VAPID + Service Worker | 2 | — |
| C1.2 Backend push endpoint | 1 | S2.1 |
| C2.1 Leaderboard backend | 1 | S2.1 |
| C2.2 Leaderboard frontend | 2 | C2.1 |

**Score esperado post-Sprint 4**: Competitividad 6.0→7.0

### Sprint 5+ (Semanas 7-14) — Mobile App
| Tarea | Semanas | Dependencias |
|-------|---------|-------------|
| C3.1 Setup + Auth | 1 | — |
| C3.2 Core features | 2 | C3.1 |
| C3.3 Gamificación | 2 | C3.2 |
| C3.4 AI Features | 1 | C3.3 |
| C3.5 Offline + Polish | 2 | C3.4 |

**Score esperado post-Sprint 5+**: Competitividad 7.0→7.5, Global 7.8

---

## Resumen de impacto

| Fase | Inversión | Score Antes | Score Después | Delta |
|------|-----------|-------------|---------------|-------|
| S1 + S2 (Seguridad) | 8 días | 5.5 | 8.0 | +2.5 |
| D1 + D2 + D3 (DX) | 19 días | 6.5 | 8.0 | +1.5 |
| C1 + C2 (Push + Leaderboard) | 9 días | 6.0 | 7.0 | +1.0 |
| C3 (Mobile) | 8 semanas | 6.0 | 7.5 | +1.5 |
| **Total** | **~14 semanas** | **6.9** | **7.8** | **+0.9** |

---

## Lo que NO se debe cambiar

Para preservar la funcionalidad, estilo y diseño existentes de iALab:

- ❌ NO modificar componentes de UI existentes (solo agregar wrapper de seguridad si es necesario)
- ❌ NO cambiar firmas de hooks públicos ni métodos del store
- ❌ NO alterar el diseño visual, colores corporativos (#004B63), tipografía o layout
- ❌ NO eliminar funcionalidad existente (solo migrar capa lógica)
- ❌ NO reescribir componentes — solo tipar (TS) o sanitizar (seguridad)
- ✅ Mantener `fallbackLng: 'es'` en i18n
- ✅ Mantener lazy loading y code splitting existentes
- ✅ Mantener PWA manifest y service worker (mejorar, no reemplazar)
