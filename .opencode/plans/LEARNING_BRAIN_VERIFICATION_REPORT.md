# LEARNING BRAIN VERIFICATION REPORT (STAGING REAL)

**Fecha:** 2026-08-29
**Resultado:** **PARTIAL** — el Learning Brain funciona contra staging real en la mayoría de las señales; **bloqueado en Dani (secret) + RLS/IDOR (FASE D)**.

## 1. Gates del Learning Brain

| Gate | Estado | Evidencia |
|---|---|---|
| staging real | ✅ | Supabase `dxirtihrpnlnxkxpmkmx` + migraciones 000–059 + SCHEMA_OK |
| auth real | ✅ | login STUDENT_A/PARENT_A (JWT real) |
| Student A/B diferentes | ✅ | mastery A: math 0.425/sci 0.8 · B: math 0.85/sci 0.5 |
| recommendations diferentes | ✅ | diffRecs=true (A vacía, B con contenido) |
| plans diferentes | ✅ | diffPlan=true |
| mastery cambia | ✅ | 0.35→0.395→…→0.656 (media móvil exacta) |
| difficulty cambia | ⚠️ | engine lo deriva de mastery; no expuesto como endpoint dedicado — verificado vía next-action/plan |
| Dani cambia | ❌ | `API key no configurada` — falta `DEEPSEEK_API_KEY` |
| parent insight cambia | ⚠️ | insight real `["progress","focus"]` para A; comparación B pendiente |
| persistence funciona | ✅ | mastery 0.656 persiste tras logout/login |
| RLS funciona | ❌ | authenticated lee 2 filas (vulnerable) → FASE D |
| IDOR funciona | ❌ | A→B, PA→B, PB→A = 200 → FASE D |
| early warning funciona | ⚠️ | endpoint 200; escenario (activity↓/errors↑/mastery↓) no forzado aún |
| no mocks críticos | ✅ | journey 100% staging real; únicos datos sintéticos = test users + golden data |

## 2. Dónde están las señales reales (no simuladas)

- **mastery**: `student_competency_mastery.mastery_level` — escrito y leído en vivo.
- **plan**: `learning_plans.plan_json` — generado en vivo.
- **recommendation/next-action**: engines sobre datos reales.
- **parent insight**: `parentInsights` sobre mastery real (progress + focus).
- **persistence**: DB normalizada.

## 3. Bloqueantes

1. **`DEEPSEEK_API_KEY`** (GitHub Actions) — sin él, **Dani no puede responder** (500) y el bloque de memoria no se genera. Es el único secret faltante para completar la señal Dani.
2. **FASE D** — RLS (041/049) e IDOR (falta `requireStudentAccess`) impiden declarar RLS/IDOR verificados. Confirmados **en vivo** en staging.

## 4. Conclusión

El **Learning Brain** está operativo contra staging real en: auth, perfil, learning graph, mastery (evolución exacta), planes, next-action, parent insights y persistencia. **No VERIFIED** hasta:
- agregar `DEEPSEEK_API_KEY` → verificar Dani contextual (perfil/mastery/memoria/plan/horario);
- FASE D → RLS/IDOR;
- forzar el escenario de early warning.
