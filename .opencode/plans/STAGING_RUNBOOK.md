# STAGING RUNBOOK — SmartBoard 3.0

**Fecha:** 2026-08-29
**Estado:** PLANO EJECUTABLE — **no se crea infraestructura remota todavía** (condición: NO staging automático, NO producción, NO merge, NO 059 productiva).
**Precedente:** FASE C fresh DB ✅ (CI_GREEN, run 33264200790).

---

## 0. PREREQUISITOS (accesos necesarios)

| Acceso | Para | Dónde se obtiene |
|---|---|---|
| Cuenta Supabase con plan (free ok) | Crear proyecto STAGING separado | https://supabase.com |
| `SUPABASE_ACCESS_TOKEN` (sbp_...) | `supabase link` / CLI | Account → Access Tokens |
| Cuenta Render (o Vercel) | Backend staging | dashboard |
| Cuenta Vercel | Frontend staging | dashboard |
| `DEEPSEEK_API_KEY` real | Dani/IA en staging | plataforma DeepSeek |
| Google TTS key (opcional) | voz | — |
| GitHub secrets del repo | CI/deploy | Settings → Secrets |

> **NUNCA** usar las keys/credenciales de producción (`srirrwpgswlnuqfgtule`, Render prod, Vercel prod) para staging. Proyectos y credenciales 100% separados.

---

## 1. ARQUITECTURA (separación estricta)

```
LOCAL          edutechlife-frontend  → localhost:5174 → localhost:3001 (backend local) → Supabase DEV (local o proyecto dev)
STAGING        frontend-staging     → staging-backend → Supabase STAGING (proyecto nuevo)
PRODUCTION     edutechlife.co       → edutechlife-backend.onrender.com → Supabase srirrwpgswlnuqfgtule
```

| Capa | LOCAL | STAGING | PRODUCTION |
|---|---|---|---|
| Branch | `recovery/foundation-phase-a` | rama dedicada (p. ej. `staging`) o deploy preview de la feature | `main` |
| Supabase | local (`supabase start`) o proyecto dev | **proyecto nuevo** (ref distinto) | `srirrwpgswlnuqfgtule` |
| Backend | `localhost:3001` | Render/Vercel staging | Render prod |
| Frontend | Vite dev | Vercel preview/staging | Vercel prod |
| DB | 000–059 | 000–059 + (FASE D: RLS) | solo 059 (conciliación) |

Reglas:
- **Cada entorno con su par de keys** (service_role, anon).
- **CORS del backend**: `ALLOWED_ORIGINS` debe incluir el dominio staging (`app.js`).
- **Ningún seed/credencial real** — usuarios sintéticos `.test`.

---

## 2. SUPABASE STAGING (crear proyecto separado)

1. Dashboard → **New project** → nombre `edutechlife-staging`, región cercana, **password nueva** (guardar en gestor).
2. Anotar: `project_ref` (ej. `abcdefghijklm`), `SUPABASE_URL` (`https://<ref>.supabase.co`), `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`.
3. Aplicar migraciones — **una de estas**:
   - **CLI** (recomendado): `supabase link --project-ref <ref>` (con `SUPABASE_ACCESS_TOKEN`) → `supabase db push` (aplica 000→059 en orden; el historial queda alineado).
   - **SQL Editor**: pegar 000→059 en orden dentro de transacciones (más manual).
4. Verificar: `psql` o sondeo read-only (service key) de `sessions`, `points_history`, `crisis_alerts`, `conversations`, `achievements` → 200. Correr `supabase/validate_schema.sql`.
5. **FASE D (pendiente)**: aplicar la migración de RLS que elimina 041/049/042 antes de abrir staging a usuarios reales.

## 3. BACKEND STAGING

1. Copiar `edutechlife-backend/.env.example` → `.env.staging` con:
   ```
   SUPABASE_URL=<staging-url>
   SUPABASE_SERVICE_ROLE_KEY=<staging-service-role>
   DEEPSEEK_API_KEY=<real>
   FRONTEND_URL=<https://frontend-staging-domain>
   BACKEND_URL=<https://backend-staging-domain>
   PORT=3001
   NODE_ENV=production   # (los rate limiters se activan; ajustar si molesta en pruebas)
   ```
2. Deploy (Render): nuevo servicio apuntando a la rama staging; start `npm start`; env desde `.env.staging`.
3. **CORS**: agregar `https://<frontend-staging>` a `ALLOWED_ORIGINS` en `app.js` (o hacerlo configurable por env).
4. Verificar: `curl https://<backend-staging>/api/health` → 200.

## 4. FRONTEND STAGING

1. `.env.staging`:
   ```
   VITE_SUPABASE_URL=<staging-url>
   VITE_SUPABASE_ANON_KEY=<staging-anon>
   VITE_API_BASE_URL=<backend-staging>
   VITE_API_URL=<backend-staging>
   ```
2. Deploy (Vercel): nuevo proyecto/preview apuntando a la rama staging; build `npm run build:fast`.
3. Verificar: `https://<frontend-staging>/` carga; el login usa el backend staging.

## 5. AUTH

- Supabase Auth habilitado (config.toml `[auth] enabled=true`).
- Login: `POST /api/auth/login` (proxy backend) con email/password sintéticos.
- Parent: `POST /api/auth/parent-register` + verificación por token (email). Para staging usar emails `.test` y la verificación se hace con el link/API.
- Roles: `user_metadata.role` = `parent` para padres (⚠️ FASE D: mover a `app_metadata`).

## 6. TEST USERS (sintéticos — sin datos reales)

| User | Email (sintético) | Edad | Grado | Perfil |
|---|---|---|---|---|
| STUDENT_A | `student.a.staging@edutechlife.test` | 12 | 7 (grade_level 7) | Matemáticas débil; Ecuaciones débil; Ciencias fuerte |
| STUDENT_B | `student.b.staging@edutechlife.test` | 12 | 7 | Matemáticas fuerte; Ciencias débil |
| PARENT_A | `parent.a.staging@edutechlife.test` | adult | — | padre de A |
| PARENT_B | `parent.b.staging@edutechlife.test` | adult | — | padre de B |

Creación (script de seeding — FASE E, no ejecutado ahora):
1. `supabase.auth.admin.createUser({ email, password: <aleatoria segura>, email_confirm: true })` por cada uno.
2. Insertar en `students` (auth_id, name='Estudiante A', age=12, grade='7', grade_level=7, school='Staging School').
3. `parent_student_links`: (PARENT_A ↔ STUDENT_A), (PARENT_B ↔ STUDENT_B).

## 7. GOLDEN DATA (reproducible)

Competencies MEN 6-7 (seed 053):
- `co_matematicas_6-7_0` (números enteros/racionales) · `_1` (**ecuaciones lineales**) · `_2` (áreas/volúmenes) · `_3` (estadística)
- `co_ciencias_naturales_6-7_0` (célula) · `_1` (herencia) · `_2` (Newton) · `_3` (ecosistemas)
- `co_lenguaje_6-7_0..2`

**STUDENT_A** — `student_competency_mastery`:
| competency_id | mastery_level |
|---|---|
| co_matematicas_6-7_0 | 0.45 |
| co_matematicas_6-7_1 (ecuaciones) | **0.35** |
| co_matematicas_6-7_2 | 0.50 |
| co_matematicas_6-7_3 | 0.40 |
| co_ciencias_naturales_6-7_0..3 | 0.80 (promedio) |
| co_lenguaje_6-7_0..2 | 0.60 |

**STUDENT_B**:
| competency_id | mastery_level |
|---|---|
| co_matematicas_6-7_0..3 | 0.85 (promedio) |
| co_matematicas_6-7_1 (ecuaciones) | **0.90** |
| co_ciencias_naturales_6-7_0..3 | **0.50** (promedio) |
| co_lenguaje_6-7_0..2 | 0.65 |

Datos adicionales (idempotentes):
- `sessions`: 1-2 sesiones recientes por estudiante (subject math para A, science para B) para el detector de hábito.
- `learning_plans`: un plan daily activo por estudiante (o dejarlo que lo genere `/adaptive/daily-plan`).
- `missions`/`badges`: del seed 054 (ya en migraciones); sin desbloqueos.
- `dani_memory`: opcional; vacía al inicio (se verifica que Dani la llena).

Script de seed: `scripts/seed-staging.js` (propuesto, no creado) que usa el service role de staging.

## 8. VERIFICATION (post-deploy)

| Check | Cómo |
|---|---|
| Schema | `supabase/validate_schema.sql` |
| Tablas críticas | sondeo read-only (200) |
| Backend | `/api/health` 200 |
| Auth | login STUDENT_A → token válido |
| Golden journey | `GOLDEN_USER_JOURNEY.md` |
| RLS/IDOR | sección 10-11 del journey |
| CI | `migrations-check` en verde |

## 9. ROLLBACK (staging)

- Supabase staging: `supabase db reset` (es staging, no hay datos que preservar) o `supabase db push` revert con una migración aditiva.
- Backend/frontend staging: redeploy de un commit anterior.
- **No afecta producción**: staging es 100% independiente; si algo sale mal, se descarta el proyecto staging y se recrea.

## 10. SECRETS

- Keys de staging van en los dashboards (Render/Vercel) o en `.env.staging` **gitignored**. NUNCA en el repo.
- Verificar que `.env.staging` esté en `.gitignore` (si se crea).
- `supabase/.temp/linked-project.json` local apunta al staging (nunca subir).

## 11. ORDEN DE EJECUCIÓN RECOMENDADO

1. Crear proyecto Supabase staging + migraciones 000–059 + validate_schema.
2. Crear test users + golden data (script FASE E).
3. Deploy backend staging (CORS incluido) + health check.
4. Deploy frontend staging + login check.
5. Ejecutar `GOLDEN_USER_JOURNEY.md` (journey + differentiation + evolution + Dani + parent + IDOR + RLS + persistence + early warning).
6. Registrar evidencia; recién entonces evaluar FASE D (RLS) y release.
