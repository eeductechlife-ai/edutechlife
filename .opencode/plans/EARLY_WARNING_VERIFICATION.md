# EARLY WARNING VERIFICATION (FASE E4) — STAGING REAL

**Fecha:** 2026-08-30
**Run CI:** `33316670821`
**Estado:** **VERIFIED** (detección + reflejo en parent insight).

## 1. Escenario construido

**BASELINE** (golden data): actividad normal, errores bajos, mastery estable → **sin warnings** ✅ (verificado en corridas previas).

**DETERIORO controlado** (vía service):
- `learning_streaks.last_activity_date` → 5 días atrás (activity ↓)
- `student_competency_mastery` (ecuaciones) → mastery 0.2, `practice_count` 6 (errors ↑, mastery ↓)

## 2. Resultado

| Check | Resultado | Evidencia |
|---|---|---|
| `GET /adaptive/warnings` dispara | ✅ | **`["repeated_errors","inactivity","streak_breaks"]`** |
| Warning con WHAT/WHY/ACTION/EVIDENCE | ✅ | `{type:"repeated_errors", severity:"medium", recommendation:"Se detectaron 1 competencias con errores repetidos en matematicas. Dani puede ayudar..."}` (evidence_json en DB) |
| Parent insight refleja riesgo | ✅ | insight_types = **`["progress","risk","focus","habit"]`** (aparece `risk`) |
| Parent alert (email) | ⚠️ | `parentAlertsService` no está montado (FASE P9); la señal al padre es hoy el insight de riesgo + wellbeing. Documentado, no ocultado |

## 3. Confianza

- Confidence del warning: derivada de `mastery_level` (0.2) + `practice_count` (6) en `evidence_json`. Los detectores usan columnas reales (FASE B).
- Escenario reproducible en el journey (`early warning: deterioro dispara warning` + `early warning → parent insight refleja el riesgo`).

## 4. Pendiente
- Parent alert por email: requiere montar `parentAlertsService` + `RESEND_API_KEY` (FASE P9/G).
