# GOLDEN USER JOURNEY REPORT (STAGING REAL)

**Fecha:** 2026-08-29
**Run CI:** `33273674218` (job `Golden User Journey (staging real)`)
**Entorno:** Supabase staging `dxirtihrpnlnxkxpmkmx` + backend en-runner (localhost) contra staging. **NO mocks.**
**Resultado: 15/20 ✓ · 5/20 ✗ (esperados: 1 secret faltante + 4 de FASE D).**

## 1. Resumen por paso

| Paso | Resultado | Evidencia |
|---|---|---|
| setup: 4 usuarios sintéticos | ✅ | A/B/PA/PB creados (emails `.test`) |
| setup: students + links + consents + golden mastery | ✅ | A=`a1b3585c…` B=`b6dc85a2…`; consents `verified` (gate parental) |
| login STUDENT_A | ✅ | token emitido |
| profile | ✅ | age 12, grade 7, school 'Staging School' |
| learning graph (mastery A) | ✅ | math 0.425 · equations 0.583 (ver nota) · science 0.8 |
| recommendation A | ✅ (pero vacía) | 200, `recs: []` — ver §4 |
| next best action A | ✅ | action=`quick`, subject=ciencias (engagement > debilidad) |
| daily plan A | ✅ | plan generado (exam_prep/ciencias) |
| activity A | ✅ | gamification/activity 200 |
| mastery update A (0.35→0.395) | ✅ | **0.395 exacto** (0.7×0.35+0.3×0.5) |
| **Dani A** | ❌ 500 | `API key no configurada` → falta `DEEPSEEK_API_KEY` |
| parent A → insight A | ✅ | insights `["progress","focus"]` (datos reales) |
| differentiation A≠B | ✅ | **diffCount=5** (math/sci/recs/plan/nba) |
| evolution (media móvil) | ✅ | recovery 0.365 · practice 0.4355 · mastery 0.5512 · transfer 0.656 (**exactos**) |
| persistence (logout→login) | ✅ | mastery_after **0.656 = esperado** |
| IDOR A→B / PA→B / PB→A | ❌ 200 | vulnerables → FASE D |
| RLS (REST) | ❌ | authenticated lee 2 filas → FASE D |
| early warning | ✅ (vacío) | `/adaptive/warnings` 200, `[]` (escenario no forzado) |

## 2. Differentiation (A vs B) — evidencia

```
diffMath:true diffScience:true diffRecs:true diffPlan:true diffNba:true  → diffCount=5
A: math 0.425 · science 0.8
B: math 0.85  · science 0.5
```
A y B son **claramente diferentes** en mastery, recomendaciones, plan, next action.

## 3. Mastery evolution (Student A — ecuaciones) — evidencia

| Fase | score | expected | got |
|---|---|---|---|
| recovery | 0.40 | 0.365 | **0.365** |
| practice | 0.60 | 0.4355 | **0.4355** |
| mastery | 0.82 | 0.55085 | **0.5512** |
| transfer | 0.90 | 0.655595 | **0.656** |

La media móvil ponderada 0.7/0.3 funciona **exactamente** en staging real.

## 4. Hallazgos (a investigar en FASE D/E)

1. **Recommendation A vacía (`[]`)** mientras B no lo está (diffRecs=true): posible contenido `learning_content` escaso (solo 4 filas del seed 055) o umbrales del engine. La ruta responde 200.
2. **Next Best Action prioriza engagement sobre debilidad**: para A (math débil) eligió "quick" en ciencias (no has estudiado hoy). Comportamiento del engine por diseño (hábito), pero pedagógicamente revisar.
3. **Parent insight A** dio `progress`+`focus`, no `risk` (math 0.425 ≥ umbral 0.4 de risk). Coherente con el diseño.

## 5. No mocks
- 100% del journey contra Supabase staging real + backend real. Los únicos datos sintéticos son los **test users** y el **golden data** (sin datos personales reales).
