# GOLDEN USER JOURNEY — SmartBoard 3.0 (staging)

**Fecha:** 2026-08-29
**Entorno:** STAGING (ver `STAGING_RUNBOOK.md`). NO ejecutar en producción.
**Precedente:** FASE C fresh DB ✅.
**Nota de honestidad:** los pasos **IDOR (10)** esperan **rechazo** — hoy el backend NO tiene `requireStudentAccess` (FASE D). Hasta que FASE D aterrice, esos tests **fallarán** (dato de evidencia, no de regresión).

---

## 0. Precondiciones

- [ ] Staging desplegado (Supabase + backend + frontend).
- [ ] Test users creados (STUDENT_A/B, PARENT_A/B).
- [ ] Golden data cargada (sección 7 del runbook).
- [ ] `BASE` = `https://<frontend-staging>` · `API` = `https://<backend-staging>`.

---

## 1. GOLDEN JOURNEY (login → … → parent)

| Paso | Acción | Assert esperado |
|---|---|---|
| 1.1 | `POST {API}/api/auth/login {email: student.a.staging@edutechlife.test, password}` | 200 + `token` (JWT) |
| 1.2 | `GET {API}/api/smartboard/student-profile` (Bearer A) | 200; `age:12`, `grade:'7'`, `name` de A |
| 1.3 | `GET {API}/api/smartboard/adaptive/mastery?studentId={A}` | 200; `mastery_level` matemáticas ~0.45, ecuaciones 0.35, ciencias 0.80 |
| 1.4 | `POST {API}/api/smartboard/adaptive/recommendations {studentId:A}` | 200; recomendación priorizada apunta a **matemáticas/ecuaciones** |
| 1.5 | `POST {API}/api/smartboard/adaptive/daily-plan {studentId:A, availableMinutes:20}` | 200; plan con actividad de matemáticas en primer lugar |
| 1.6 | `POST {API}/api/smartboard/adaptive/mastery {studentId:A, competencyId:'co_matematicas_6-7_1', score:0.5}` | 200; `mastery` sube de 0.35 → ~0.455 (0.7*0.35+0.5*0.3) |
| 1.7 | `POST {API}/api/smartboard/dani/chat {studentId:A, message:'Necesito ayuda con ecuaciones'}` | 200 streaming; respuesta **menciona** ecuaciones/refuerzo (usa mastery real) |
| 1.8 | Login PARENT_A → `GET {API}/api/smartboard/parent/insights?studentId={A}` | 200; insight "Refuerzo necesario en Matemáticas" + evidencia |
| 1.9 | `GET {API}/api/smartboard/adaptive/warnings?studentId={A}` | 200; sin warnings (golden data no dispara) |

Evidencia: capturar cada respuesta (solo campos relevantes).

## 2. DIFFERENTIATION (A vs B)

Repetir pasos 1.1–1.7 con STUDENT_B (token B). Comparar:

| Señal | STUDENT_A (esperado) | STUDENT_B (esperado) |
|---|---|---|
| Mastery matemáticas | ~0.45 | ~0.85 |
| Mastery ecuaciones | 0.35 | 0.90 |
| Mastery ciencias | 0.80 | 0.50 |
| Next action | reforzar ecuaciones | reforzar ciencias |
| Recommendation | contenido math/ecuaciones | contenido ciencias |
| Plan daily | actividad de matemáticas | actividad de ciencias |
| Dani (mismo prompt) | menciona matemáticas como débil | menciona ciencias como débil |
| Difficulty sugerida | baja/media en math | alta en math, baja en science |

**Criterio:** al menos 5 de las señales deben ser **diferentes** entre A y B.

## 3. EVOLUTION (Student A: recovery → practice → mastery → transfer)

Secuencia de POST mastery sobre `co_matematicas_6-7_1` (ecuaciones), verificando la media móvil 0.7/0.3:

| Fase | score enviado | mastery resultante (esperado) | Insight esperado |
|---|---|---|---|
| **recovery** | 0.40 | 0.35→0.365 | sigue débil; recs de práctica |
| **practice** | 0.60 | →0.435 | sube; siguiente práctica |
| **mastery** | 0.82 | →0.551 | >0.5: deja de ser "crítico" |
| **transfer** | 0.90 | →0.656 | aplica en problema nuevo |

Fórmula: `new = 0.7*old + 0.3*score`.
Tras cada paso verificar: `GET mastery`, `POST recommendations`, `GET parent/insights` reflejan el cambio real (mismo valor de fuente `student_competency_mastery.mastery_level`).

## 4. DANI TEST (contexto que llega al modelo)

Documentar, para una llamada a `/api/smartboard/dani/chat`, qué bloques llegan (debug del orquestador):

| Bloque | Fuente | Esperado en staging |
|---|---|---|
| age | students.age | 12 |
| grade | students.grade_level | 7 |
| goal | (pendiente — no hay columna goals; documentar) | — |
| competency | student_competency_mastery | ecuaciones 0.35 |
| mastery | mastery_level | sí |
| memory | dani_memory | vacía al inicio; se llena tras chats |
| plan | learning_plans.plan_json | plan daily activo |
| schedule | timetable_slots.day_of_week | (si hay horario cargado) |
| recent activity | sessions | sesión reciente |
| errors | frequent_errors / practice_count | si aplica |

Registrar el `system prompt` final (con datos enmascarados si hay nombres) como evidencia de que TODOS los bloques llegan.

## 5. PARENT TEST

- PARENT_A:
  - `GET /parent/insights?studentId={A}` → 200 con insights (WHAT=qué, WHY=por qué, ACTION=acción sugerida, EVIDENCE=dominio %).
  - `GET /parent/insights?studentId={B}` → **rechazado** (FASE D; hoy no).
  - `GET /wellbeing-status` → solo alertas de A.
- El insight de riesgo debe mostrar el **% real** de dominio (de mastery_level), no texto genérico.

## 6. PERSISTENCE (logout → login)

1. Modificar: mastery (POST), plan (POST daily-plan), memory (chat con Dani), mission (POST `/gamification/activity`), points, badge.
2. `POST /api/auth/logout` (limpia sesión).
3. Login de nuevo.
4. Verificar que TODO persiste (leer cada fuente desde DB, no desde localStorage):
   - mastery → `GET /adaptive/mastery`
   - plan → `GET /adaptive/state` (o `learning_plans`)
   - memory → `dani_memory`
   - mission → `GET /gamification/missions`
   - points → `points_history` (suma)
   - badge → `GET /gamification/badges`

## 7. EARLY WARNING SCENARIO (Student A)

Construir el escenario:
1. `activity ↓`: no hay sesiones recientes (3+ días) → detector `inactivity`.
2. `errors ↑`: `practice_count` alto con `mastery_level` bajo en ecuaciones → detector `repeated_errors`.
3. `mastery ↓`: bajar `mastery_level` (o dejar que la media muestre caída) → detector `performance_drop`.

Verificar cadena: `GET /adaptive/warnings` → warning presente → `POST /adaptive/warnings/:id/resolve` → desaparece → (con parent_alerts montado en FASE D) alerta al padre.

## 8. RLS TEST (por rol)

| Operación | Rol | Esperado |
|---|---|---|
| SELECT students (own) | student A | ok |
| SELECT students (otro) | student A | **rechazado** (hoy: FALLA — 041/049 permisiva) |
| SELECT vak_results (own) | student A | ok |
| SELECT vak_results (otro) | student A | **rechazado** (hoy: FALLA) |
| INSERT points_history (own) | student A | ok |
| UPDATE students.age | student A | **rechazado** (026 lo retiró) |
| SELECT parent_alerts (own) | parent A | ok |
| SELECT sessions (otro) | anon | rechazado |
| SELECT competencies | anon | ok (público) |

Documentar cada resultado real como evidencia. Los "rechazado esperado que hoy fallan" confirman el bloqueo FASE D.

## 9. IDOR TEST (bloqueado hasta FASE D)

| Intento | Token | Recurso | Esperado (FASE D) |
|---|---|---|---|
| A → B | STUDENT_A | `GET /adaptive/mastery?studentId={B}` | 403 |
| A → B | STUDENT_A | `POST /adaptive/daily-plan {studentId:B}` | 403 |
| PARENT_A → B | PARENT_A | `GET /parent/insights?studentId={B}` | 403 |
| PARENT_B → A | PARENT_B | `GET /parent/insights?studentId={A}` | 403 |

Hoy estos **responden 200** (vulnerabilidad conocida). Este test es el criterio de aceptación de FASE D.

## 10. CRITERIOS DE ÉXITO

- [ ] Journey completo (1) fluye con datos reales.
- [ ] A/B diferentes en ≥5 señales (2).
- [ ] Evolution sigue la media móvil exacta (3).
- [ ] Dani recibe ≥8 de 10 bloques de contexto (4).
- [ ] Parent A ve solo A; insights con WHAT/WHY/ACTION/EVIDENCE reales (5).
- [ ] Persistence tras logout/login (6).
- [ ] Early warning dispara la cadena (7).
- [ ] RLS documentado por rol (8).
- [ ] IDOR: hoy FALLA → **bloquea FASE D** (9).
