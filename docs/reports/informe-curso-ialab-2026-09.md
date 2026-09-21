# Informe QA + UX — Curso "Introducción a la IA Generativa" (IALab)

**Fecha:** 2026-09-20
**Evaluador:** estudiante simulado ("Ana Audit QA", usuario `e126ec97-…`)
**Sitio:** https://www.edutechlife.co · **Backend:** https://edutechlife-backend.onrender.com · **DB:** Supabase `srirrwpgswlnuqfgtule`
**Método:** recorrido end-to-end como estudiante real (videos en tiempo real, PDFs, OVAs interactivas, Desafíos, "Mi reto", Comunidad), generación y descarga del certificado, e investigación de causa raíz con el skill `systematic-debugging`. Documentado con el skill `documentation-and-adrs`.
**Énfasis del informe:** **interacción del estudiante** (fricción, motivación, feedback, carga cognitiva y accesibilidad), por ser el eje crítico de la experiencia.

---

## 0. Tabla de contenidos
1. Resumen ejecutivo
2. Alcance y metodología
3. Contexto técnico (arquitectura que afecta la interacción)
4. **Interacción del estudiante (sección central)**
5. Resultados por módulo (detalle)
6. Certificado: proceso, causa raíz y correcciones
7. Hallazgos detallados (con repro · impacto en interacción · estado)
8. Correcciones aplicadas (commits)
9. Recomendaciones priorizadas
10. Anexos

---

## 1. Resumen ejecutivo

- **Curso completado al 100%** (5/5 módulos). **Certificado generado y descargado** (PDF válido).
- **Health score — Curso (experiencia de estudiante): 6/10.** El contenido es sólido y los recursos están bien producidos, pero la plataforma introduce **fricción evitable** en momentos clave (desbloqueo de actividades, mecánicas de OVA inconsistentes, modales cruzados y mensajes que no explican qué falta).
- **Health score — Interacción del estudiante: 5.5/10.** Los puntos de contacto existen (gamificación, feedback, actividades), pero la **retroalimentación es genérica** y el estudiante frecuentemente **no sabe qué hacer ni por qué está bloqueado**.
- **Health score — Certificado: 9/10** tras correcciones (diseño fiel; pendiente número único y logos reales).

| Módulo | Nota | Comunidad | Desafío | Mi reto | Recursos |
|---|---|---|---|---|---|
| 1 · Artesano Digital (Prompts) | 96.5 | 100% | 88.3% | 100% | 100% |
| 2 · Arquitecto Digital (ChatGPT) | 97.0 | 100% | 90% | 100% | 100% |
| 3 · Detective de Datos (Gemini) | 95.1 | 100% | 83.8% | 100% | 100% |
| 4 · Alquimista Digital (NotebookLM) | 91.8 | 100% | 86.7% | 88% | 100% |
| 5 · Guardián Digital (Ética IA) | 94.0 | 100% | 80% | 100% | 100% |

`completedModules: [1,2,3,4,5]` · Progreso global: **95%** · Certificado emitido: `EDL-2026-00000000`.

**Los 3 riesgos de interacción que más impactan al estudiante**
1. **Bloqueos sin explicación** (H2, H7, H12): no se puede avanzar y el mensaje no dice qué falta.
2. **Mecánicas de OVA inconsistentes** (H11, H19): cada tipo interactúa distinto (clic, `ArrowRight`, girar ruleta, simulador), sin señalización clara.
3. **Feedback genérico/cruzado** (H5, H6): la nota llega, pero con textos de otro módulo o placeholders rotos, lo que resta credibilidad.

---

## 2. Alcance y metodología

**Alcance:** los 5 módulos, sus 3 actividades (Comunidad, Desafío, Mi reto), los recursos (video/PDF/imagen/OVA), la generación de certificado y las pantallas de progreso.

**Método de interacción (lo que realmente se hizo):**
- **Videos** reproducidos **en tiempo real** (sin adelantar) para validar el marcado automático al finalizar. Ejemplos: M4 "Primeros Pasos" (10:15), M5 "Privacidad y IA" (9:20), M5 "IA Ética" (6:04).
- **PDFs** desplazados hasta el final para marcarlos como vistos.
- **OVAs** resueltas por su mecánica específica (quiz, recorrido, simulador, emparejar, estrellas, curso guiado).
- **Desafíos**: 3–4 pasos con justificaciones, matrices y protocolos; umbral de aprobación 80%.
- **Mi reto (Ruleta)**: 10 preguntas; umbral 80%.
- **Comunidad**: publicación en el foro por módulo.
- **Certificado**: intento de generación, análisis del error, corrección y descarga.

**Evidencia:** capturas de pantalla, PDF descargado, inspección de red (200/201/401/404), consola del navegador y análisis del código fuente (rutas, providers, store, modales, evaluadores).

---

## 3. Contexto técnico (lo que condiciona la interacción)

- **Rutas:** `/ialab` (CourseHome) y `/ialab/:moduleId` (AILabPage). Hasta esta auditoría, **solo `/ialab/:moduleId` montaba `IALabProvider`**; `/ialab` no, lo que dejaba sin contextos al modal de certificado.
- **Estado:** store de zustand (progreso, gamificación, UI) + contextos (`ProgressContext`, `IALabProgressContext`, `IALabUIContext`) + persistencia en Supabase.
- **Progreso y desbloqueo:** `moduleProgress[moduleId]`, `completedModules`, pesos de nota (Comunidad 5%, Desafío 30%, Mi reto 35%, Recursos 30%). El desbloqueo del Desafío depende de `completedModules`.
- **Recursos:** el umbral `resourcesCompleted` se deriva del catálogo de recursos por módulo (video/PDF/imagen/OVA).
- **Evaluación (offline):** con la IA no disponible, la nota se calcula con `localEvaluate` por **longitud/estructura** de las respuestas.
- **Modales:** `IALabModals` renderiza cada modal según flags del store (`showQuizModal`, `showPremiumEvaluationModal`, `showCertificateModal`, …).

---

## 4. Interacción del estudiante (sección central)

> Por pedido explícito: la interacción es el factor más importante. Aquí se documenta **cómo interactúa el estudiante**, dónde se traba, cómo se siente y qué se debería mejorar.

### 4.1 Flujo de entrada
- **Login** claro (email/usuario + contraseña, opciones sociales). Tras iniciar sesión, el título de la pestaña **se queda en "Iniciar Sesión | Edutechlife"** (H15): pequeño pero resta pulcritud.
- El registro presentó un fallo de perfil (H1) que impedía crear cuentas nuevas hasta aplicar el fix del trigger (y aún depende de la `service_role` en Render).

### 4.2 Navegación y orientación
- **Barra lateral** con módulos y un botón de progreso ("Mi Progreso", "Plan", "Ranking").
- **Pestañas del módulo:** Inicio / Objetivos / Actividades / Práctica / Guardados. Buena separación de intención.
- **Problema recurrente (H8):** al entrar directo a `/ialab/3` la app **redirige al último módulo visitado** (el store manda sobre la URL). Rompe enlaces compartidos y desorienta.
- **Problema recurrente (H7):** "Mi Progreso", "Certificados" y "Reintentar reto" **abren el modal del Desafío/Ruleta** en vez de su destino → el estudiante pierde el contexto y cree que la app "se equivoca".

### 4.3 Interacción con contenidos
| Tipo | Cómo se completa | Riesgo de interacción |
|---|---|---|
| **Video** | Debe reproducirse completo; al 100% se marca | No se puede adelantar; **reabrir reinicia** el conteo (percibido como "no guarda") |
| **PDF** | Desplazar hasta el final | Claro |
| **Imagen/JPEG** | Botón "Marcar como visto" | Claro |
| **OVA quiz** | Elegir opción y avanzar | Claro |
| **OVA recorrido** | Avance con **ArrowRight** (los botones "Siguiente" no responden) | **Muy poco descubrible** |
| **OVA simulador** | "Comenzar Simulador" → responder → "Procesar Resultados" | Pasos no evidentes |
| **OVA emparejar** | Clic caso + clic concepto | Sin instrucciones explícitas |
| **OVA estrellas** | Clic estrella → elegir opción | Sin señalizar el ciclo |
| **OVA curso guiado** | "Comenzar Curso" → pasos → FINALIZAR | No finaliza si no se llega al último paso |

**Hallazgo de fondo:** la mecánica **cambia según el contenido** y no hay un patrón visual consistente. El estudiante no puede anticipar cómo se avanza. Esto es la mayor fuente de fricción cognitiva.

### 4.4 Actividades
- **Comunidad (5%):** publicar en el foro. Bajo esfuerzo, alta claridad. Bien.
- **Desafío (30%):** 3–4 pasos con redacción/matriz/protocolo. Exigente y bien planteado **conceptualmente**, pero:
  - El umbral es 80%, y la evaluación offline por longitud penaliza respuestas "buenas pero cortas".
  - Requisitos **no evidentes** (p. ej. en M5: matriz de severidad ≥6 celdas y relevancia por principio) que, si faltan, bajan la nota sin explicar por qué.
- **Mi reto — Ruleta (35%):** 10 preguntas. Interacción lúdica y motivante, pero:
  - **Fricción mecánica:** hay que **"girar la ruleta"** en cada pregunta; si el giro no "cae", el botón no responde hasta reintentar.
  - Feedback posterior con **placeholder roto** ("Aprobaste con {score}% o más", H5).

### 4.5 Gamificación y motivación
- **XP por actividad**, **rachas**, **niveles**, **badges**, confeti y notificaciones. Correcto como capa motivacional.
- El **Desafío exige ≥80** y consume intentos (3 + cooldown 12h): la fricción aparece cuando el estudiante **no entiende qué falló**, sin retroalimentación accionable.
- **Feedback cruzado (H6):** los resultados de M3/M4/M5 muestran el texto del M1 ("dominio en diseño de prompts") → el estudiante siente que la evaluación "no lee" su módulo.

### 4.6 Retroalimentación y errores percibidos
- **Mensajes de bloqueo genéricos (H17):** "Completa el recurso anterior para continuar" sin decir cuál.
- **Bloqueo silencioso del Desafío (H2):** toast *"Completa el reto y el desafío del Módulo 2…"* sin listar el faltante real (2 recursos del M2).
- **Errores de credibilidad (H5, H6, H14):** placeholders y claves i18n crudas visibles al usuario.
- **Marcado de recursos "fantasma" (H11):** una OVA completada visualmente no se persiste y deja el siguiente recurso bloqueado.

### 4.7 Carga cognitiva y accesibilidad
- **Carga cognitiva alta** en OVAs largas (20–30 min) con mecánicas cambiantes y sin indicador de "cómo continuar".
- **Móvil/teclado:** algunos avances dependen de `ArrowRight` (recorridos), poco accesible para lectores de pantalla y usuarios táctiles.
- **Service Worker (H19):** sirve JS antiguo tras cada deploy → el estudiante puede ver una UI ya corregida como si no lo estuviera (generó confusión real).

### 4.8 Mapa de fricción (resumen)
| Momento | Fricción | Evidencia | Severidad |
|---|---|---|---|
| Entrar a un módulo por URL | Redirige a otro módulo | H8 | Media |
| Abrir "Mi Progreso"/"Certificados" | Abre el modal equivocado | H7 | Media |
| Resolver OVA "recorrido" | Botones no responden; requiere `ArrowRight` | H19 | Alta |
| Terminar OVA "curso" | No persiste si no se llega al último paso | H11 | Alta |
| Desafío bloqueado | No dice qué falta | H2/H17 | Alta |
| Entregar Desafío | Nota por longitud; requisitos no evidentes | H9 | Media |
| Reintentar "Mi reto" | Abre el Desafío | H7 | Media |
| Leer resultado | Placeholder `{score}%` / feedback de otro módulo | H5/H6 | Media |
| Tras un deploy | UI antigua por caché PWA | H19 | Media |

### 4.9 Métricas de interacción observadas
- **Errores de consola por sesión:** 40–100+ (mayoría `401` por JWT expirado, i18n y red).
- **Intentos consumidos:** M5 Desafío **2** (75% → 80%), M5 Mi reto **2** (65% → 100%).
- **Punto de abandono más probable:** Desafío M3 sin poder abrirse; OVA M4 "La Fórmula Sonora" sin desbloquear el siguiente recurso.
- **Tiempo de video real consumido:** > 60 min solo en los videos de M4–M5.

---

## 5. Resultados por módulo (detalle)

**M1 — Artesano Digital (Prompts) · 96.5**
- Recursos: 2 videos, 1 PDF, OVA "La Materia Prima" (quiz 5/5, 500 XP), OVA "El Cincel", Lab "El Martillo".
- Actividades: Desafío 88.3%, Mi reto 100% (10/10), Comunidad 100%.
- Interacción: fluida; buena introducción conceptual.

**M2 — Arquitecto Digital (ChatGPT) · 97.0**
- Recursos: video, 2 PDF, 3 OVAs (incl. "La Caja de Herramientas", "La Línea de Montaje").
- Actividades: Desafío 90%, Mi reto 100%, Comunidad 100%.
- **Interacción:** al inicio quedaron **2 recursos sin realizar** (tema "La Fachada del Edificio": JPEG + OVA), lo que **bloqueó el Desafío del M3** (H2). No había señal de que faltaran.

**M3 — Detective de Datos (Gemini) · 95.1**
- Recursos: video 7:34, Manual 11 pág, PDF "Ejercicios de Campo", OVA "La Lupa Multimodal" (5/5), video "Casos Reales" 2:41, PNG "Mapa del Ecosistema", OVA "El Caso Abierto", OVA "El Archivo Forense".
- Actividades: Desafío 83.8%, Mi reto 100%, Comunidad 100%.
- **Interacción:** el Desafío **no abría** (bloqueo por M2); se resolvió tras completar los 2 recursos faltantes. OVAs de recorrido requerían `ArrowRight`.

**M4 — Alquimista Digital (NotebookLM) · 91.8**
- Recursos (3 temas): "Primeros Pasos" 10:15 + Guía + OVA "El Grimorio"; JPEG "Resúmenes Inteligentes" + PDF "NotebookLM cuaderno del futuro" + OVA "El Crisol"; "Crea tu propio podcast" 2:16 + OVA "La Fórmula Sonora" (30 min) + "El Estudio Alquímico" + "La Transmutación".
- Actividades: Desafío 86.7%, Mi reto 88%, Comunidad 100%.
- **Interacción:** "La Fórmula Sonora" (curso guiado) **no persistía** su finalización (H11) y **bloqueaba** los recursos siguientes. El estudiante percibe "lo hice y no cuenta".

**M5 — Guardián Digital (Ética IA) · 94.0**
- Recursos: "Los Pilares de la IA" 1:56 + PDF 9 pág + OVA "El Espejo de la Verdad" (emparejar 5 casos); "Privacidad y IA" 9:20 + PDF 13 pág + OVA "La Brújula de Riesgos" (estrellas 3/3); "IA Ética" 6:04 + OVA "El Tribunal Ético" (6 dilemas) + OVA "Casos del Guardián".
- Actividades: Desafío **80%**, Mi reto **100%**, Comunidad 100%.
- **Interacción:** Desafío con **2 intentos** (75% → 80%) por requisitos no evidentes (matriz de severidad, relevancia por principio). Mi reto con **2 intentos** (65% → 100%). Reintentar "Mi reto" abría el Desafío (H7).

---

## 6. Certificado: proceso, causa raíz y correcciones

**Síntoma:** el certificado no aparecía ni se podía generar, aunque el curso estaba 100% completado.

**Causa raíz (3 capas, encontradas con el skill de debugging):**
1. `courseCompleted` se calculaba **solo al montar** (`IALabProgressProvider`, deps `[]`), antes de rehidratar el progreso → `false`.
2. `CertificatesModal` leía el progreso **solo de los contextos de IALab**, que en `/ialab` están vacíos → "no elegible".
3. La ruta `/ialab` **no estaba envuelta en `IALabProvider`** → `generateCertificate` era `undefined` → "Error desconocido" **sin petición de red**.

**Correcciones y verificación:**
- `d4360170` (flag), `86bf736e` (fallback al store), `6ad7cd57` (provider en la ruta) → `POST /certificates` **201** y certificado creado.
- `7ceb7e23` rediseño fiel al original (PDF + vista previa).
- `91cb99b9` vista previa con **container queries** (ya no se recorta) + traducción LinkedIn.
- `50c40d6f` firmas en una línea y guilloche más suave.
- **Evidencia:** `Certificado_Introducción_a_la_IA_Generativa_Ana_Audit_QA.pdf` (v1.3, 1 página, ~4.9 MB).

---

## 7. Hallazgos detallados

> Severidad: **Crítica/Alta** = impide avanzar o completar; **Media** = fricción/credibilidad; **Baja** = pulido. Estado: ✅ corregido · ⏳ pendiente.

### Críticos / Alto
- **H1 · Registro de perfil (RLS).** ⏳ (parcial) Trigger corregido (migración `088`); producción aún requiere `SUPABASE_SERVICE_ROLE_KEY` (JWT) en Render para el insert en `users`.
  - Repro: alta de usuario → 400 `new row violates row-level security policy for table "users"`.
- **H2 · Desafío M3 bloqueado sin explicación.** ⏳ (latente)
  - Repro: M2 con 6/8 recursos → M3 Desafío no abre; toast genérico.
  - Causa: `completedModules` por transición `<80→≥80` (`progressSlice.js:169-183`) + M2 incompleto.
- **H3 · Generar certificado fallaba.** ✅ (ver §6).
- **H4 · Vista previa del certificado se recortaba.** ✅ (container queries).

### Medio
- **H5 · `{score}%` sin interpolar** en "Mi reto". ⏳
- **H6 · Feedback cruzado** ("diseño de prompts" en M3/M4/M5). ⏳
- **H7 · Modales cruzados** ("Mi Progreso"/"Certificados"/"Reintentar reto" → Desafío/Ruleta). ⏳
- **H8 · Auto-redirección de módulo** ignora la URL. ⏳
- **H9 · IA offline → nota por longitud** (`localEvaluate`); no evalúa calidad real. ⏳
- **H10 · `maxLength` descarta texto en silencio** (síntesis 300, justificación 150). ⏳
- **H11 · OVA "curso" no persiste** si no se llega al último paso (`score>=100`). ⏳
- **H12 · Conteo de recursos inconsistente** (M5 `resourcesCompleted:true` con 7/9; M4 exige 8). ⏳
- **H13 · N.º de certificado en ceros** (`EDL-2026-00000000`); link de verificación inválido. ⏳
- **H14 · i18n sin traducir** (`modals.certificates.share_linkedin`). ✅
- **H15 · Título de pestaña obsoleto** tras login. ⏳
- **H16 · JWT expirado intermitente** (401 → requiere refresco). ⏳

### Bajo
- **H17 · Mensajes de bloqueo genéricos.** ⏳
- **H18 · Logos TIC/Alcaldía aproximados** (faltan assets). ⏳
- **H19 · Service Worker sirve JS obsoleto** tras deploy. ⏳

---

## 8. Correcciones aplicadas (commits en `main`)

| Commit | Cambio |
|---|---|
| `d4360170` | `IALabProgressProvider`: reevaluar `checkCourseCompletion` al cambiar el progreso. |
| `86bf736e` | `CertificatesModal`: fallback al store de zustand. |
| `6ad7cd57` | `routes/index.jsx`: envolver `/ialab` con `IALabProvider`. |
| `7ceb7e23` | Rediseño del certificado (PDF + vista previa) fiel al original. |
| `91cb99b9` | Vista previa con container queries + i18n `share_linkedin`. |
| `50c40d6f` | Firmas en una línea y guilloche más suave. |

Además: migración `supabase/migrations/088_fix_handle_new_user_profile_insert.sql`.

---

## 9. Recomendaciones priorizadas

**Interacción (primero, por su impacto)**
1. **Patrón de avance único y visible** en todas las OVAs: un mismo botón "Continuar" con instrucción ("clic", "arrastra", "gira"). Elimina la carga de descubrir la mecánica.
2. **Mensajes de bloqueo accionables:** indicar el recurso/actividad faltante y un enlace directo.
3. **Feedback específico por módulo y con criterios visibles** antes de enviar (rúbrica: qué se evalúa y con qué peso).
4. **Persistencia confiable** del marcado de recursos; si no se persiste, avisar y permitir reintentar.
5. **Resetear flags de modales al cerrar** para eliminar el cruce (H7).
6. **Respetar la URL** en la navegación entre módulos (H8).

**Progreso y evaluación**
7. Derivar el desbloqueo de `currentScore>=80` como respaldo de `completedModules` (H2).
8. Unificar el cálculo de `resourcesCompleted` con el catálogo real (H12).
9. Si la IA está offline, **etiquetar la nota como estimada** y explicar el criterio (H9).

**Contenido de marca y certificado**
10. Asignar `cert_number` secuencial/único y resolver la URL de verificación (H13).
11. Integrar logos oficiales (TIC, Alcaldía) (H18).

**Plataforma**
12. i18n completo + test que falle ante `{` sin interpolar (H5, H14).
13. Estrategia PWA de actualización (skipWaiting/clientsClaim) (H19).
14. Corregir títulos de página dinámicos (H15) y manejo de sesión/JWT (H16).

---

## 10. Anexos
- Capturas: `live-preview3.png` (vista del certificado), `cert-check.png` (PDF renderizado).
- PDF descargado: `.playwright-mcp/Certificado-Introducción-a-la-IA-Generativa-Ana-Audit-QA.pdf`.
- Migración SQL: `supabase/migrations/088_fix_handle_new_user_profile_insert.sql`.
- Archivos clave revisados: `IALabProgressProvider.jsx`, `routes/index.jsx`, `CertificatesModal.jsx`, `CertificatePreview.jsx`, `progressSlice.js`, `ModuleOverviewCard.jsx`, `useIALabUI.js`, `moduleConfig.js`, `useCelebrationEffects.js`.

---

## 11. Actualización 2026-09-21 — correcciones aplicadas y verificadas en producción

Todo lo siguiente quedó desplegado y comprobado contra `www.edutechlife.co` /
`edutechlife-backend.onrender.com` (no solo en local).

### 11.1 Registro de estudiantes
| Hallazgo | Evidencia | Corrección |
|---|---|---|
| Perfil huérfano si fallaba el INSERT en `public.users`; el correo ya no se podía registrar | `POST /api/auth/signup` → `400 {"error":"Profile creation failed: … row-level security policy …"}` + auth user creado sin perfil | Rollback (`deleteUser`) y error accionable — `b4058f3f` |
| Al detectar perfil duplicado se respondía **sin token** (el estudiante quedaba deslogueado) | lectura de `authService.signUp` | Se devuelve sesión (token + refreshToken) — `b4058f3f` |
| Tras registrarse, `RoleProtectedRoute` devolvía a `/login` | `supabase.auth.getSession()` nulo: el registro no sembraba la sesión del SDK (el login sí) | `seedClientSession()` en el registro — `10722fc1` |
| El formulario de registro no se adaptaba a la pantalla | Medido: contenedor 517px en viewport 1440px, columnas 193px/290px, texto partido palabra por línea (página anidada dentro de `WelcomeScreen`) | Modo `embedded` (sin página/tarjeta/marketing duplicados) — `d6c032b1` |
| Verificación E2E | `201 + token`; fila en `public.users`; registro por UI → `/ialab` → `/ialab/1` con curso cargado y 0 errores de consola | — |

### 11.2 Ingreso/registro con Gmail (Google OAuth)
| Hallazgo | Evidencia | Corrección |
|---|---|---|
| El inicio funciona | `GET /api/auth/oauth/google` → **302** a Google con `client_id` y `redirect_uri=…/api/auth/callback`; Google muestra el selector de cuentas | — |
| **Tramo final roto**: el callback hacía POST a `${FRONTEND_URL}/auth/exchange-token` | `curl -X POST https://www.edutechlife.co/auth/exchange-token` → **404 NOT_FOUND** (sin rewrite en `vercel.json`) | El callback redirige **302** a `/auth/callback` con la sesión en el **fragmento (#)** — `8c93bf26` |
| El diseño por cookies HttpOnly no puede funcionar en producción | Las cookies las setea `onrender.com` y el sitio pide vía rewrite en `edutechlife.co` (cross-site) | Se usa el fragmento; el camino por cookies/email queda como compatibilidad |
| Errores de OAuth silenciosos | `?error=…` volvía a `/login` y no se mostraba nada | Mensaje visible (i18n es/en/pt) — `8c93bf26` |
| `account_type` de cuentas OAuth | Consulta a Supabase: `ialab` (sin riesgo de redirección a SmartBoard) | — |
| Verificación | Fragmento simulado con token real → `/ialab`, hash limpiado, sesión del SDK sembrada, curso `/ialab/1` OK; error simulado → `/login?error=token_exchange_failed` visible | — |

### 11.3 Backend / operación
- **El deploy de Render fallaba en cada push** (exit 1): `app.js` construía `AlertListenerService` con `SUPABASE_SERVICE_ROLE_KEY`, ausente en Render (la variable está con el nombre legado `SUPABASE_SERVICE_KEY`), y `createClient` lanzaba fuera del `try/catch`. Corregido con cascada de nombres y listener tolerante — `de8315fe`.
- Assets de sonido declarados y ausentes (`achievement`, `streak`, `level-up`, `correct`, `wrong`): 404 en cada logro. Agregados + test que exige que cada ruta declarada exista en `public/` — `bbb38270`, `80f382b6`.
- Rendimiento del certificado y del panel: reintentos de sesión/JWT corregidos emitiendo `supabase.auth.token-refreshed` (listener muerto) — `0987ac1a`.
- UI móvil: Práctica restaurada en los 5 módulos, "Todo"→"Inicio", Módulos como panel deslizante, panel de MAX sin desborde con safe-areas y teclado — `a33052fd`, `488152f2`.
- MAX personalizado con el nombre real del estudiante (perfil o derivado del correo) — `488152f2`.

### 11.4 Pendientes
1. **Accesibilidad de teclado en OVAs (H-4.3)**: pendiente; toca ~15 visores y hay que validar módulo por módulo.
2. **Rúbrica visible antes de enviar (H-5.2)**: bloqueada; `moduleConfig.js` no contiene criterios/pesos y no deben inventarse (alteraría la calificación).
3. **Render**: aviso de "Payment failed" en el workspace; instancia Free con spin-down (50 s de arranque en frío).
4. **Opcional**: añadir `SUPABASE_SERVICE_ROLE_KEY` (nombre canónico) en Render; el código ya funciona con el nombre legado.
5. **Cuentas de prueba creadas** (borrar si no se necesitan): `sofia.curso.1790015211546@gmail.com`, `valentina.curso.1790014585@gmail.com`, `juan.curso.1790014660501@gmail.com` (contraseña `CursoIalab2026!`), `qa.curso.1790012743@gmail.com` (`QaCurso2026!`), `edutechlife.qa.1790011454@gmail.com` (`QaRegistro2026!`).
