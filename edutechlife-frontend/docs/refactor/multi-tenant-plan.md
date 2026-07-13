# Fase 4 — Plan multi-tenant B2B (fundaciones)

Autor: Atlas · Rama: `phase-4/saas-foundations`

## Qué existe hoy

- `institutions` / `institution_members`: nuevas (este commit), con RLS.
  Ver `supabase_institutions_schema.sql`.
- `vak_diagnostics.institution_id`: sigue siendo `text`, nullable, y hoy
  ningún flujo lo puebla (`DiagnosticoVAK.jsx` lee `studentInfo.institutionId`
  pero nada lo asigna). Ahora tiene un trigger "FK suave" que exige que, si se
  guarda un valor, coincida con un `institutions.slug` existente.
- `src/services/institutionService.js`: `fetchInstitutions`,
  `fetchInstitutionMembers`, `createInstitution` — mismo estilo defensivo que
  `institutionalAnalytics.js`.

## Cómo se conecta end-to-end (siguientes iteraciones)

### 1. Captura de institución en el diagnóstico (vía slug en la URL)

- Ruta propuesta: `/diagnostico/:institutionSlug` (o `?inst=slug` como
  fallback si cambiar rutas es costoso).
- Al montar `DiagnosticoVAK`, leer el slug de la URL y guardarlo en el estado
  local (`studentInfo.institutionId = slug`), no resolver a `uuid` en el
  cliente — el trigger valida server-side.
- Si el slug no existe en `institutions`, `saveVakDiagnostic` fallará por el
  trigger; el guardado ya es "silencioso ante fallos" (no rompe el flujo del
  estudiante), pero conviene loguear el error para detectar slugs mal
  configurados en campañas/enlaces compartidos con colegios.
- Sin slug en la URL → `institution_id: null` (comportamiento actual, B2C).

### 2. Filtro en panel admin (Valeria)

- `institutionalAnalytics.fetchVakDiagnostics(client, { institutionId })` ya
  soporta filtrar por `institution_id` (texto/slug) — no requiere cambios.
- Agregar en el panel un selector poblado con
  `institutionService.fetchInstitutions(client)` que filtre por `slug`.
- La vista `vak_institution_summary` (schema VAK) ya agrupa por
  `institution_id` — sirve tal cual para el desglose por colegio.

### 3. Roles (`admin_edutech`, `rector`, `docente`, `estudiante`)

- Hoy solo hay un rol global "admin" vía `public_metadata.role` de Clerk
  (usado en `vak_diagnostics` y en las nuevas tablas). Los roles por
  institución (`institution_members.role`) están modelados y con RLS, pero
  **aún no hay UI ni flujo que los asigne** — el alta de miembros queda para
  la siguiente iteración (política RLS actual: solo admin interno inserta).
- Próximo paso: onboarding de rector (admin interno crea la institución +
  primer `rector` vía `institution_members`), y que el rector invite
  `docente`/`estudiante` desde un panel propio (requiere nueva policy de
  insert delegada al rol `rector` sobre su propia institución — no incluida
  aquí para mantener el alcance acotado a fundaciones).

## Migración futura de `vak_diagnostics.institution_id` (text → uuid)

Ver comentario extenso en `supabase_institutions_schema.sql`. Resumen: no se
migra ahora por riesgo sobre tabla productiva; se agrega FK suave por
trigger contra `institutions.slug`. Migrar a `uuid` con FK real solo cuando
el flujo de captura por slug esté validado en producción y se confirme (vía
backfill) que no quedan valores huérfanos.

## Fuera de alcance de esta iteración

- `AdminDashboard.jsx` (Forge la instrumenta con el selector de institución).
- `DiagnosticoVAK.jsx` (Pulse la toca para leer el slug de la URL).
- Policies de auto-servicio para `rector`/`docente` (insert delegado).
