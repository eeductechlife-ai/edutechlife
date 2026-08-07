# QA Report — SmartBoard (Auditoría Exhaustiva)

**Fecha:** 2026-08-07
**Método:** Análisis estático de código + verificación de primera mano + ejecución de tests (backend, unit, a11y, build)
**Rama:** main
**Alcance:** Dashboard estudiante, dashboard padre, landing `/conoce-smartboard`, backend `/api/smartboard`, estándares internacionales
**Modo:** Solo reporte (sin correcciones)

---

## HEALTH SCORE GLOBAL: 5.8 / 10

| Dimensión | Score | Estado |
|---|---|---|
| Funcionalidad estudiante | 6/10 | Core funciona; economía de puntos rota |
| Funcionalidad padre | 5/10 | Fuga de datos entre estudiantes + doble conteo |
| Carga de elementos / rendimiento | 7/10 | Skeletons, lazy load, build OK; 89 errores TS |
| Accesibilidad (WCAG 2.1/2.2) | 5/10 | Buenas bases CSS + tests axe, pero bugs visibles graves |
| Privacidad (COPPA/GDPR/Ley 1581) | 4/10 | Modal y erasure presentes; verificación de consentimiento NO implementada |
| Seguridad (RLS, auth, backend) | 4/10 | Múltiples RLS `USING(true)`, registro de padre sin verificación |
| Internacionalización (i18n) | 4/10 | pt.json es copia del español; ~70% del UI estudiante hardcoded |
| Testing | 6/10 | 25 backend + 225 unit + 36 a11y pasan; e2e con token falso |

---

## 1. EVIDENCIA DE VERIFICACIÓN (ejecutada)

| Comando | Resultado |
|---|---|
| `vitest run src/__tests__/routes/smartboard.test.js` (backend) | ✅ 25/25 pass |
| `vitest run src/store src/components/kids-dashboard/__tests__` | ✅ 225/225 pass |
| `vitest run src/tests/a11y/` | ✅ 36 pass, 2 skipped |
| `tsc --noEmit -p tsconfig.typecheck.json` | ❌ **89 errores** en 4 archivos (2 de smartboard) |
| `npm run build:fast` (Vite + Terser + PWA) | ✅ Build OK (2m07s); 8 chunks >250KB |
| Conteo i18n | pt.json: 285/302 claves smartboard idénticas a es.json |

---

## 2. HALLAZGOS CRÍTICOS (confirmados de primera mano)

### 2.1 🔴 CRÍTICO — Fuga de datos entre estudiantes en el dashboard del padre
`useParentDashboardRealtime.ts:57-197` crea 3 canales `postgres_changes` **sin filtrar por relación padre→hijo**:
- `students` filtrado por `last_activity>gt.` global (línea 65)
- `sessions` filtrado por `end_time=is.null` (línea 105)
- `points_history` **sin filtro alguno** (líneas 171-173)

`SmartBoardParentDashboard.jsx:163-171` fusiona todos esos eventos en `data` del hijo. Impacto: **un padre ve sesiones, puntos y actividad de OTROS estudiantes**; además el realtime usa `students.id` (UUID de BD) mientras el dashboard compara con `studentId || userId` (auth uid) — `SmartBoardParentDashboard.jsx:134-136`. Y con migración 023 sin aplicar en prod (ver 2.8), el acceso realtime depende de RLS inexistente.

### 2.2 🔴 CRÍTICO — Registro de padre sin verificación de parentesco
`authService.js:233-293` (`parent-register`) permite registrarse como padre de **cualquier email de estudiante** sin validar tutoría, identidad ni consentimiento; confirma el email sin verificación (`email_confirm: true`, `local+padre@`). Combinado con el upsert **cliente** de `parent_student_links` en `SmartBoardLogin.jsx:77-90` (RLS `parent_user_id=auth.uid()`, migración 023:24-27), un atacante que conozca el email de un estudiante puede registrarse como su padre y leer su `smartboard_kids_data`.

### 2.3 🔴 CRÍTICO — Políticas RLS inseguras (acceso desde el cliente)
Migración 011 usa `USING(true)/WITH CHECK(true)` en tablas alcanzables por la anon key:
- `points_history` INSERT `WITH CHECK(true)` (011:497-499)
- `academic_context`, `achievements`, `learning_streaks`, `smartboard_settings` FOR ALL `USING(true)` (011:559-620)
- **`parent_dashboards`**: `USING (parent_email = current_user OR is_active = true)` (011:570) — `current_user` es el rol de Postgres ('authenticated'), nunca un email; `is_active = true` matchea TODAS las filas → **cualquier usuario autenticado lee todos los parent_dashboards**.
- `parent_consents` INSERT/UPDATE `USING(true)` (008:32-39)
- `crisis_alerts` FOR ALL `USING(true)` (009:37-39)
- `activity_log` FOR ALL `USING(true)` (`create_activity_log.sql:33-34`)

`smartboard_kids_data` tiene policy admin `auth.jwt()->>'role'='admin'` que **nunca matchea** (el JWT nativo no lleva claim `role`).

### 2.4 🔴 CRÍTICO — Consentimiento parental COPPA/Ley 1581 incompleto
`POST /parental-consent` (`smartboard.js:396-437`) inserta `verification_status: 'pending'` y **nunca envía el email de verificación** que la UI promete (`SmartBoardHabeasDataModal.jsx:201-202, 234`: "recibirán un link de verificación"). No hay endpoint de confirmación, revocación ni gate de edad efectivo (el menor se autodeclara vía `age_range` con default 13, `ConsentGate.jsx:47,107`). El dashboard no bloquea a menores sin consentimiento verificado. `studentAge` no se valida tipo/rango.

### 2.5 🔴 CRÍTICO — Economía de puntos rota (estudiante)
- **Canjear recompensas nunca descuenta**: `addPoints` hace `Math.max(0, parseInt(...))` (`useSmartBoardActions.js:9-10`) que descarta negativos; `unlockReward` llama `addPoints(-reward.cost)` (línea 41) → el costo se ignora.
- **VAK paga 600 en vez de 300**: `addPoints(300)` en `VAKDiagnosticEnhanced.jsx:71` **y** +300 en `setVakResultAndRecommendations` (`useSmartBoardActions.js:253`).
- **Oral paga doble**: +10 por respuesta correcta (`OralExamSimulator.jsx:105`) y +`correctCount*10` al final (líneas 127-128).

### 2.6 🔴 ALTO — Doble conteo y duplicados en puntos en vivo del padre
`SmartBoardParentDashboard.jsx:163-171`: `prev.points + livePoints.reduce(...)` suma el **acumulado completo** de `livePoints` en cada actualización (crece y se trunca a 50) → los mismos puntos se suman repetidamente. `[...livePoints, ...prev.history]` prepende entradas ya presentes → duplicados. Además el poll (30s) de `setData(supabaseData)` (143-145) **sobrescribe** la fusión en vivo en cada ciclo.

### 2.7 🔴 ALTO — Race condition de carga inicial (pérdida de datos cloud)
`useSmartBoardPersistence.js:49-242`: el efecto depende solo de `[syncLoading]`. Si en el primer render el cliente Supabase aún es `null`, `loadData()` retorna `null` (`useSmartBoardSync.js:20-28`), se cargan solo datos locales y `dataLoaded=true`; al cambiar `syncLoading`, `if (dataLoaded) return` (línea 51) **bloquea la carga remota para siempre**. Además `mergeWithLocal` usa `Math.max` para números (`smartboardSync.js:179`) → los puntos de dos dispositivos no se suman, se queda con el mayor.

### 2.8 🟠 ALTO — RLS 023 probablemente NO aplicada en producción
Según el session-summary de CLAUDE.md, las migraciones 003-010 nunca se aplicaron en prod y la BD se construyó a mano. La política de lectura de padres sobre `smartboard_kids_data` (023:44-57) y la tabla `parent_student_links` probablemente no existen en prod → el dashboard del padre solo lee **localStorage del dispositivo del padre** (datos vacíos o de otro usuario del mismo dispositivo). Hay además **drift de esquema**: `users`, `smartboard_kids_data`, `activity_log` y columnas `age_range/clerk_id/role` se usan en código pero no se crean en `supabase/migrations/`.

### 2.9 🟠 ALTO — Eliminación de datos (derecho al olvido) incompleta
`DELETE /delete-user-data` (`smartboard.js:619-672`) borra 5 tablas pero **no borra la fila en `users`** ni `parent_student_links` (migración 023); si no existe fila en `students`, la cascada no limpia `sessions/points_history/vak_results/etc.`; `activity_log.user_id` es TEXT legacy Clerk → IDs antiguos no matchean el UUID nativo.

### 2.10 🟠 ALTO — Login padre vía `/sign-up/smartboard` no guarda `student_id`
`SmartBoardSignUpPage.jsx:81-88` guarda token/role/email/parent_name pero **no `student_id`** (a diferencia de `SmartBoardLogin.jsx:68`). El dashboard usa `studentId || userId` (`SmartBoardParentDashboard.jsx:127`) → usa el id del padre como id del hijo → **no encuentra datos del hijo** (dashboard vacío, solo localStorage).

---

## 3. ESTÁNDARES INTERNACIONALES

### 3.1 WCAG 2.1 / 2.2 (Accesibilidad) — Cumplimiento parcial (~50%)
**Presente:**
- 5 suites de tests axe (36 tests, jest-axe) — `src/tests/a11y/` ✅
- `a11y.css`: `:focus-visible` (3px), `prefers-reduced-motion`, `forced-colors`, targets ≥44px, `.sr-only` ✅
- `useA11y` hook (reduced-motion, high-contrast, skip-to-main)
- ARIA correcto en FAQ landing (`aria-expanded/controls/labelledby`), HabeasDataModal (`role="dialog"`, `aria-modal`)
- Landings con `role="region"` + `aria-label`, headings 1×h1 → h2 → h3 sin saltos

**Violaciones confirmadas:**
1. **`[aria-live]` global esconde el contador de puntos del TopBar**: `a11y.css:134-139` aplica `position:absolute; width:1px; height:1px` a TODOS los `[aria-live]` → el pill de puntos del estudiante (que usa `aria-live="polite"`, `TopBar.jsx:87-97`) queda invisible (1×1px). **Bug visual grave.**
2. `RewardCard` es `div` con `onClick` sin `role="button"`/`tabIndex` → no operable por teclado (`PointsRewardsSystem.jsx:11-46`).
3. Botón `<motion.button>` anidado dentro de otro `<motion.button>` en el reminder de Dani (`SmartBoardKidsDashboard.jsx:277-314`) → HTML inválido.
4. Drawer móvil del padre sin `aria-expanded`/focus trap/Escape/`role="dialog"` (`SmartBoardParentDashboard.jsx:193-201`).
5. Gráficas Recharts sin alternativas ARIA (barras no legibles por SR).
6. Sin skip-link activo; wizard landing sin `aria-live` (el cambio de sección no se anuncia); dots/nav sin `aria-label`/`aria-current`.
7. `MagneticButton` aplica `cursor-none` sobre CTAs de la landing (`MagneticButton.jsx:83`).
8. Botones icon-only sin aria-label (editar/borrar mazo ✏️🗑️, borrar fila ✕, cerrar preview).
9. Contraste bajo: `text-[9px]/[10px]` con `opacity-90/80/70` y `text-slate-400`/`text-white/40` sobre fondos claros.
10. **SmartBoard no está cubierto por tests axe** (solo componentes genéricos del sitio). No hay axe en CI/e2e. Sin declaración de conformidad WCAG AA.

### 3.2 Privacidad — COPPA / GDPR / Ley 1581 (Colombia) / Habeas Data — Parcial (~40%)
**Presente:** Modal de Habeas Data con Ley 1581 + COPPA y datos de contacto (`SmartBoardHabeasDataModal.jsx:103-190`); modal de consentimiento GDPR/COPPA; derecho al olvido con botón visible; tabla `parent_consents` (auditoría); bienestar devuelve solo conteos agregados (minimización) — `smartboard.js:560-597`; `weekly-report` escapa el nombre con `escapeHtml`.

**Faltante/débil:**
- **Verificación de consentimiento parental NO implementada** (ver 2.4) — la cuenta de un menor se activa sin verificación real.
- Erasure incompleto (ver 2.9).
- Sin portabilidad/exportación de datos (solo blob crudo).
- Sin revocación de consentimiento en UI/backend.
- Sin retención programada/borrado automático.
- Sin referencia a LGPD (Brasil); solo Ley 1581 + GDPR + COPPA.
- Claims de contacto sobre "GDPR compliance y SOC 2" (`docs/.../contact.js:378`) sin respaldo documental.

### 3.3 Otros estándares
- **ISO/IEC 42001, ISO/IEC 23053, NIST AI RMF**: solo **contenido de marketing** (`AutomationArchitect.jsx`, `automationData/standards.js`). Sin evidencia de implementación real en la capa de datos/SmartBoard.
- **Educativos**: no se encontró referencia a estándares pedagógicos (p.ej. IMS Caliper, xAPI, SCORM).

---

## 4. FUNCIONALIDAD POR SECCIÓN

### 4.1 Landing `/conoce-smartboard` (wizard de 9 pasos)
| Sección | Funciona | Notas |
|---|---|---|
| Hero | ✅ | CTA navega a `/sign-up/smartboard`; contadores hardcodeados (2500/94/12000) |
| Qué es | ✅ | Video `/smarboard.mp4` (2.9MB, preload=metadata); **`/smarboard.mov` no existe** (recurso muerto) |
| Estilos VAK | ✅ | Loop infinito de flotación NO respeta `prefers-reduced-motion` |
| Beneficios | ✅ | Tilt 3D |
| Tranquilidad | ✅ | Duplica `TiltCard` (código duplicado) |
| Cómo funciona | ✅ | Timeline 4 pasos + CTA |
| Planes | ⚠️ | **3 de 4 iconos de pago invisibles** (`fa-mobile-screen`, `fa-building-columns`, `fa-qrcode`) y `fa-gift` → `iconMapping.jsx:478` |
| Testimonios | ✅ | Marquee CSS 3× duplicado; sin pausa/aria |
| Final/FAQ | ✅ | ARIA correcto; 9 FAQs **sin structured data FAQPage** |
| Nav sticky | ⚠️ | Sin `aria-current`; transiciones con `filter: blur(4px)` (jank) |

**SEO:** title genérico "SmartBoard | Edutechlife"; sin FAQPage/Product/Offer en JSON-LD pese a tener 9 FAQs y 2 precios. Ruta prerenderizada en `scripts/prerender.mjs`.

### 4.2 Dashboard estudiante — tabs renderizados (`CinematicContent.jsx`)
| Tab | Funciona | Notas |
|---|---|---|
| inicio | ✅ | Misió del día + Hero + Points/Rewards (lazy) |
| misiones | ✅ | `completeMission` manual; las misiones VAK/subir actividad no se auto-completan |
| materias | ✅ | Grid de materias |
| puntos | ✅ | Tienda/historial; **canjear no descuenta** (2.5) |
| vak | ✅ | **600 pts por diagnóstico** (2.5) |
| curriculo | ⚠️ | **Placeholder** (`SectionFallback`, no implementado) |
| calificaciones | ⚠️ | `!scanMode === "image"` (línea 409) → **errores del modo manual nunca se muestran** (siempre false); prompt usa `vakResult.dominant` pero el contexto usa `predominantStyle` → el estilo VAK nunca llega al análisis; `addPoints?.(50)` sin reason |
| oral (Habla con Dani) | ⚠️ | **Paga doble** (2.5) |
| examenes | ⚠️ | `DeckQuiz.answer` usa `score` de closure → puntaje final incorrecto con respuestas rápidas (stale state) |
| flashcards | ⚠️ | `handleResult` suma `cards.length` a `totalStudied` pero ±1 a correct/incorrect; `fileRef` asigna `_ref` inútil |
| progreso | ✅ | SmartBoardProgress |

**Whitelist de URL desalineada** (`SmartBoardKidsDashboard.jsx:110-131`): acepta `actividades/calendario/noticias/libros/escaner/analitica/padres/podcast` que **no tienen renderer → pantalla en blanco**; omite `puntos` y `calificaciones` (que sí existen) → `?tab=calificaciones` no navega. `SmartBoardAnalytics.jsx` es **código muerto** (no montado) y tiene el helper `dc()` invertido para dark mode.

### 4.3 Dashboard padre — 6 pestañas
| Sección | Funciona | Notas |
|---|---|---|
| Resumen | ⚠️ | Wellness + 4 KPIs + charts. Datos contaminados por realtime global (2.1) y doble conteo (2.6) |
| Actividad | ⚠️ | Presencia en vivo + ActivityLog; `setTimeout` sin cleanup (línea 155); `LivePresenceBar` marca online a **cualquier estudiante** (`ParentControls.jsx:76-79`) |
| Progreso | ⚠️ | VAK bars + charts repetidos |
| Bienestar | ✅ | `WellbeingCard` (conteos agregados) + hábitos |
| Recursos | ✅ | Contenido hardcodeado |
| Mi Plan | ✅ | ROI hero + features + `WeeklyReportCard` (envío por email) |

**No muestra calificaciones** del hijo en ninguna pestaña. No hay estado de loading/error/vacío (`loading` del hook nunca se consume). No hay UI para vincular/desvincular hijos ni selector. `handleLogout` no revoca sesión Supabase ni usa `signOutUser`. `RoleProtectedRoute` **solo comprueba existencia de `auth_token`**, no el rol (`RoleProtectedRoute.jsx:17-45`) → un estudiante logueado entra a `/smartboard/padres` con sus propios datos. `user_role` es tamperable y puede quedar "stale" (`SupabaseLoginForm/SupabaseSignUpForm` no lo limpian al entrar como estudiante).

---

## 5. CARGA DE ELEMENTOS / RENDIMIENTO

- **Bien:** skeleton global (`SmartBoardLoadingSkeleton`), skeletons por tab (`SectionFallback`), lazy load por tab, error boundaries por tab con botón reintentar, indicador offline + cola de sync, banner "Sincronizando...", PWA con workbox, vendor chunks separados, `drop_console`/`drop_debugger` en build.
- **Timeout de 3s** en carga remota con fallback local (bien), pero sin retries (mal) y con la race de 2.7.
- **Rendimiento landing:** ~115 listeners `mousemove/scroll` por partículas (`Particle.jsx` con `useMouseTracking` + `useScrollParallax` por partícula) + 5 listeners de `MagneticButton`; `filter: blur(4px)` en transiciones; `useAnimatedCounter` corre en móvil aunque las stats estén `hidden lg:flex`.
- **Build:** OK; 8 chunks >250KB (html2pdf 743KB, charts 397KB, jspdf 379KB); i18n `pt` chunk 311KB.
- **Typecheck:** 89 errores TS en `useSmartBoardSupabase.ts`, `useParentDashboardRealtime.ts`, `useNicoContext.ts`, `useNicoConversationMemory.ts`.
- **Dead code:** `SmartBoardAnalytics.jsx`, `ParentChildrenList.jsx`, `useSmartBoardStats.js`, `useTotalPoints`, `useAcademicContext`, `useUpdateSettings` importados sin uso.

---

## 6. INTERNACIONALIZACIÓN

- 302 claves `smartboard.*` en es/pt/en. **pt.json: 285/302 idénticas al es.json** → el "portugués" es español. `getData()` (`SmartBoardLandingData.js:207-217`) cae a ES para cualquier locale ≠ 'en'.
- **~70% del UI del estudiante está hardcoded en español** (sin `t()`): flashcards, exámenes, oral, calificaciones, Hero, Misió del día, onboarding, navegación/categorías, prompts de Dani.
- **Dashboard padre 100% hardcoded en español** (títulos, KPIs, wellness, "Mi Plan"). Solo 3 claves usan `t()` en `ParentControls.jsx`.
- `SmartBoardLogin.jsx` y `SmartBoardSignUpPage.jsx` (lado padre) 100% hardcoded.

---

## 7. SEGURIDAD ADICIONAL

- JWT Supabase verificado con `supabase.auth.getUser` en backend (bien). Tokens en `localStorage` → vulnerables a XSS (no httpOnly cookies).
- Sanitización global débil (regex sin allowlist, `sanitize.js:3-5`).
- Rate limit desactivado fuera de producción; `/api/auth/login` y `/parent-login` sin límite dedicado (solo apiLimiter 100/15min/IP) → fuerza bruta viable.
- Fuga de `e.message` interno en ~8 respuestas del router (`smartboard.js:79, 154, 277, 362, 435, 538, 595, 722, 817`).
- Endpoint fantasma `/api/smartboard/report` llamado por `DaniChatHeader.jsx:36` — no existe en backend.
- URLs de backend inconsistentes: Vite proxy → `edutechlife-api.vercel.app`; fallbacks en código → `edutechlife-backend.onrender.com`.
- SSE de chat sin keepalive ni límite de mensajes por sesión; escalación de crisis registra el contenido completo del mensaje del menor en `crisis_alerts`.
- Referencia legacy `window.__CLERK_AUTH_TOKEN` en `utils/api.js:401-402`.

---

## 8. RECOMENDACIONES PRIORITARIAS (para plan de remediación)

1. **P0 — Datos:** Filtrar los 3 canales realtime por `student_id` del hijo (o reemplazar por fetch+RLS); corregir doble conteo/duplicados en `SmartBoardParentDashboard.jsx:163-171`; eliminar la race de `useSmartBoardPersistence` (agregar `userId` como dep y re-cargar si `dataLoaded` con datos locales sin cloud).
2. **P0 — Seguridad:** Auditar/reescribir policies RLS de `parent_dashboards`, `points_history`, `academic_context`, `achievements`, `learning_streaks`, `smartboard_settings`, `parent_consents`, `crisis_alerts`, `activity_log`; aplicar migración 023 en staging antes de prod (nunca ejecutado); requerir verificación de parentesco real en `parent-register`.
3. **P0 — Cumplimiento:** Implementar el flujo de verificación de consentimiento parental (email + confirmación) que la UI ya promete; completar erasure (users, parent_student_links, legacy); validar `studentAge` en backend.
4. **P1 — Economía:** Arreglar `addPoints` para negativos; quitar doble VAK (600→300); quitar doble pago oral.
5. **P1 — UI:** Corregir `a11y.css:134-139` (solo ocultar regions de anuncio, no el pill de puntos); tabIndex/role en RewardCard; desanidar botones; estados de loading/error en dashboard padre; guardar `student_id` en signup padre.
6. **P2 — i18n:** Traducir pt.json real; mover hardcoded del estudiante/padre a i18n.
7. **P2 — Calidad:** Resolver los 89 errores TS; cubrir SmartBoard en tests axe + CI; añadir tests backend para chat/consent/stream; structured data FAQPage/Offer en landing; arreglar iconos de pago.

---

## 9. STATUS

**STATUS:** DONE_WITH_CONCERNS
**REASON:** Auditoría completa con verificación de primera mano y tests ejecutados. El build, 286 tests unit/backend/a11y pasan y el core funciona, pero existen 3 vulnerabilidades críticas (fuga realtime entre estudiantes, registro de padre sin verificación, RLS inseguras), un cumplimiento COPPA/1581 incompleto y la economía de puntos rota.
**RECOMMENDATION:** Tratar P0 (2.1-2.4) antes de cualquier release; verificar la migración 023 en staging antes de fusionar (según CLAUDE.md nunca se ha ejecutado contra una BD real); luego abordar P1.
