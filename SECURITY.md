# SECURITY.md — SmartBoard 3.0
> Sprint 1 · 2026-08-25

---

## Modelo de Amenazas — SmartBoard (Menores de Edad)

SmartBoard sirve a estudiantes de 6–16 años. Toda arquitectura de seguridad prioriza:
1. Protección de menores (COPPA / Ley 1581 Colombia)
2. Consentimiento parental verificado antes de cualquier acceso a IA
3. Cero exposición de datos personales a terceros sin autorización

---

## Endpoints de IA — Niveles de Protección

| Endpoint | Auth | Consent Parental | Quien lo llama |
|----------|------|-----------------|----------------|
| `POST /api/smartboard/chat/stream` | ✅ | ✅ | Dani streaming chat |
| `POST /api/smartboard/chat` | ✅ | ✅ | Dani non-streaming |
| `POST /api/smartboard/ai` | ✅ | ✅ | OralExam, Podcast, ImprovementPlan, GradeScanner, ExamPrep, BookReader, ScheduleScanner |
| `POST /api/chat` | Optional | ❌ | IALab, Nico, Admin (no SmartBoard) |
| `POST /api/chat/stream` | Optional | ❌ | IALab, Nico (no SmartBoard) |

**Regla:** Ningún componente dentro de `kids-dashboard/` puede llamar a `/api/chat` directamente.
Todos deben usar `callDeepseekSmartboard()` que va a `/api/smartboard/ai`.

---

## Fix Aplicado — Sprint 1

### Problema
Los componentes `OralExamSimulator`, `StudyPodcast`, `useImprovementPlan`, `GradeScanner`,
`ExamPrep`, `useBookReader` y `ScheduleScanner` llamaban a `callDeepseek()` → `POST /api/chat`
que solo tiene `optionalAuth` — sin verificación de consentimiento parental.

### Solución
1. **Backend**: Nuevo endpoint `POST /api/smartboard/ai` con `requireAuth + requireVerifiedParentalConsent`.
2. **Frontend**: Nueva función `callDeepseekSmartboard()` en `utils/api.js` que:
   - Siempre incluye el JWT token (`Authorization: Bearer`)
   - Llama a `/api/smartboard/ai`
   - No funciona sin token (lanza error explícito)
3. **Migración**: Todos los 7 componentes SmartBoard actualizados de `callDeepseek` → `callDeepseekSmartboard`.

---

## Middleware de Seguridad — SmartBoard

### `requireVerifiedParentalConsent`
- Verifica que exista un registro en `parent_consents` con `verified_at IS NOT NULL`
- Si no existe → 403 `{ error: 'Parental consent required' }`
- Ubicación: `edutechlife-backend/src/middleware/parentalConsent.js`

### `requireAuth`
- Verifica JWT de Clerk
- Extrae `req.userId` y `req.user`
- Si no hay token válido → 401

---

## Crisis Detection

El endpoint `/api/smartboard/chat/stream` tiene una capa adicional:
- `detectCrisis(message)` analiza el contenido del mensaje del estudiante
- Si detecta crisis → guarda en `crisis_alerts` + envía email al padre
- Palabras clave monitoreadas: autodaño, violencia, abuso

**Dani nunca diagnostica condiciones médicas o psicológicas.**

---

## Datos de Menores — Reglas

- `dani_memory`: Solo accesible por el propio estudiante (RLS `auth.uid()`)
- `parent_consents`: Solo accesible vía backend (service_role)
- `crisis_alerts`: Solo accesible vía backend
- No registrar mensajes completos de chat en ninguna tabla sin consentimiento explícito
- GDPR/Ley 1581: endpoint `DELETE /api/smartboard/delete-user-data` elimina toda la data

---

## Pendiente (próximos sprints)

- [ ] AISafetyGateway (Sprint 6): pipeline independiente input → moderation → output
- [ ] Filtros de contenido en output de modelos (moderación de respuestas)
- [ ] Control parental granular (qué módulos puede usar el hijo)
- [ ] Consentimiento por niveles de edad (COPPA < 13 vs. 13–16)
- [ ] Audit log de todas las llamadas IA por estudiante
