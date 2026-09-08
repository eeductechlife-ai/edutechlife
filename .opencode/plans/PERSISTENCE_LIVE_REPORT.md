# PERSISTENCE LIVE REPORT (STAGING REAL)

**Fecha:** 2026-08-29
**Entorno:** Supabase staging `dxirtihrpnlnxkxpmkmx` + backend real.

## 1. Verificado (logout → login → relectura)

| Dato | Acción | Resultado |
|---|---|---|
| **Mastery** | POST mastery (4 pasos de evolución) → logout → login → GET | **0.656 persiste exacto** tras logout/login ✅ |

Evidencia:
```
persistence: mastery persiste tras logout/login => {"mastery_after":0.656,"expected":0.656}
```

## 2. Fuente de verdad (DB, no localStorage)

El journey verifica que **mastery vive en `student_competency_mastery`** (la misma fuente que leen el learning graph y los motores). No hay dependencia de localStorage en el flujo del backend.

## 3. Pendiente de verificar en vivo (staging continuo / FASE E)

| Entidad | Estado |
|---|---|
| Plan (`learning_plans.plan_json`) | tabla existe; generado en el journey; re-lectura pendiente de confirmar tras re-login (se persiste en DB por diseño) |
| Memory (`dani_memory`) | requiere `DEEPSEEK_API_KEY` (Dani) para generarla → bloqueado por secret |
| Mission / points / badge | tablas existen; el journey ejecutó `gamification/activity` (200); re-lectura pendiente |

**Estado:** persistencia de **mastery VERIFIED** en staging real; el resto requiere el secret de Dani y/o FASE E para confirmación completa.

## 4. Nota de diseño
- El blob `smartboard_kids_data` sigue existiendo como **cache** del frontend (no fuente crítica de mastery); la fuente de mastery es la tabla normalizada. (Contrato FASE B.)
