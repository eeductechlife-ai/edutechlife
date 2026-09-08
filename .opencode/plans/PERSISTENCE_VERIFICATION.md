# PERSISTENCE VERIFICATION (FASE E3) — STAGING REAL

**Fecha:** 2026-08-30
**Run CI:** `33316670821`
**Estado:** **VERIFIED** (mastery, plan, mission, points, badge, session) · `dani_memory` BLOCKED (secret).

## 1. Flujo probado: WRITE → LOGOUT → LOGIN → READ (DB = fuente de verdad)

| Entidad | Write | Persiste tras logout/login | Resultado |
|---|---|---|---|
| **mastery** | POST `/adaptive/mastery` (evolución 0.35→0.656) | ✅ `GET /adaptive/mastery` → 0.656 exacto | ✅ |
| **plan** | POST `/adaptive/daily-plan` | ✅ `learning_plans` (is_active) count=1 | ✅ |
| **mission** | GET missions (seed) + POST `/gamification/activity` (dani_chat) | ✅ `student_missions` count=2 | ✅ |
| **points** | INSERT service (`points_history`) | ✅ count=3 (persiste) | ✅ |
| **badge** | POST activity → `first_chat` desbloqueado | ✅ `student_badges` count=1 | ✅ |
| **session** | INSERT service (`sessions`) | ✅ count=3 | ✅ |
| **Dani memory** | (requiere Dani) | ❌ BLOCKED — falta `DEEPSEEK_API_KEY` | ◌ |

Evidencia del paso:
```
persistence: plan/mission/points/badge/session en DB tras logout/login → {plan:1, mission:2, points:3, badge:1, session:3} ✅
persistence: mastery persiste tras logout/login → mastery_after=0.656 expected=0.656 ✅
```

## 2. Fuente de verdad

- **DB normalizada** (no localStorage, no blob). `smartboard_kids_data` sigue como cache del frontend, no como fuente crítica de estos datos.
- Los writes del backend van a `learning_plans`, `student_missions`, `student_badges`; los del frontend directo a `points_history`, `sessions` (RLS own-row tras 060).

## 3. Pendiente

- `dani_memory` (necesita Dani → secret) y re-lectura de memoria tras sesión.
