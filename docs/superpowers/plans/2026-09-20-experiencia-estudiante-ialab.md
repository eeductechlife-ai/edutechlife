# Plan de mejora — Experiencia del estudiante IALab (>9)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar la experiencia del estudiante de ~6/10 a **>9/10** sin alterar la funcionalidad (mismos flujos, misma lógica de notas y desbloqueo; solo se agregan claridad, consistencia, retroalimentación y confiabilidad).

**Architecture:** Cambios **aditivos y de presentación** en frontend (React + Tailwind + zustand + contextos IALab), i18n (es/en/pt) y una estrategia PWA de actualización. Los pocos cambios que tocan lógica son **correcciones de bugs** que restauran el comportamiento ya previsto (no cambian reglas de negocio).

**Tech Stack:** React 18, Vite, Tailwind, framer-motion, zustand, jsPDF, Supabase, react-i18next, Workbox (PWA).

---

## Estado real (actualizado 2026-09-21)

> Resumen verificado contra producción. Lo no listado como ✅ sigue pendiente.

**Plan original**
- ✅ 1.1 placeholders/i18n por módulo — `bcd91bb6`, `c704d6db`
- ✅ 1.2 mensajes de bloqueo con recurso — `f44a9d62`
- ✅ 1.3 título dinámico por ruta — `5d11e97b`
- ✅ 2.2 pista del paso en la evaluación (solo el hint; el checklist de requisitos NO se implementó: `moduleConfig.js` no tiene datos de rúbrica y inventarlos cambiaría la calificación) — `36ee8963`
- ❌ 2.1 cancelada (sin evidencia de fricción)
- ❌ 2.3 pendiente (carga/vacíos consistentes)
- ✅ 3.1 reset de flags de modales — `3374c6e0`
- ✅ 3.2 respetar la URL del módulo — `3374c6e0`
- ✅ 3.3 persistencia de finalización de OVA — `e41be101`
- ❌ 3.4 cancelada (conteo de recursos ya correcto)
- ✅ 3.5 número de certificado único + RPC de verificación — `48ba8bb9` (SQL aplicado en Supabase)
- ✅ 4.1 PWA auto-update (ya estaba: `registerType: autoUpdate`, `skipWaiting`, `clientsClaim`)
- ✅ 4.2 sesión/JWT: se emitía `token-refreshed` a nadie → el JWT renovado no llegaba al cliente — `0987ac1a`
- ❌ 4.3 accesibilidad de teclado en OVAs — pendiente (toca ~15 visores; requiere ir archivo por archivo)
- ✅ 4.4 lazy loading de imágenes de recursos — `525c451f`
- ❌ 5.1 micro-momentos: parcial (ya existían XPToast/AchievementToast/celebración)
- 🚫 5.2 rúbrica visible — bloqueada: no existen criterios/pesos en el código
- ✅ 5.3 logos oficiales del certificado (TIC, Alcaldía de Manizales, Edutechlife) — `4ba518b7`, `f461f1d4`, `73a9b4bc`

**Fuera del plan (bugs reales encontrados y corregidos en esta sesión)**
- Registro (email): perfil huérfano + respuesta sin sesión al detectar duplicado — `b4058f3f`; el registro no sembraba la sesión de supabase-js y rebotaba a /login — `10722fc1`
- Registro: layout roto (página anidada dentro de WelcomeScreen, columnas aplastadas a 193/290px) — `d6c032b1`
- Ingreso/registro con Gmail: el callback hacía POST a `/auth/exchange-token` (404) — ahora entrega la sesión por fragmento a `/auth/callback` — `8c93bf26`; errores de OAuth visibles en /login
- Backend: el deploy fallaba entero si faltaba `SUPABASE_SERVICE_ROLE_KEY` (en Render la variable está con el nombre legado) — `de8315fe`
- Assets de sonido declarados y ausentes (`achievement`, `streak`, `level-up`, `correct`, `wrong`) + test que lo evita — `bbb38270`, `80f382b6`
- Panel de MAX en móvil (desborde, punto de 8px que se agrandaba a 44px, safe-areas, teclado) y nombre real del estudiante en vez de "Usuario" — `488152f2`, más los fixes previos de la sesión
- Navegación móvil: Práctica restaurada en los 5 módulos, "Todo"→"Inicio", "Módulos" como panel deslizante — `a33052fd`, `488152f2`

**Pendientes de terceros**
- Render: aviso de "Payment failed" en el workspace (puede suspender servicios).
- Render: opcional añadir `SUPABASE_SERVICE_ROLE_KEY` con el nombre canónico (el código ya funciona con el legado).

## Restricción global (obligatoria)
- **No alterar la estructura del curso.** Todas las mejoras se **adaptan a los botones y secciones ya instaladas**.
- **No crear componentes, botones, secciones ni archivos nuevos de UI.** Se modifican textos, handlers y estilos de lo existente.
- No cambiar pesos, umbrales (80%), ni reglas de desbloqueo.
- Los helpers de lógica, si hicieran falta, van **inline** en el componente existente (no archivos nuevos).

---

## Definición de "experiencia >9"

Un estudiante califica ≥9 cuando:
1. **Nunca se queda sin saber qué hacer** (siempre hay un “siguiente” visible).
2. **Nunca se queda bloqueado sin explicación** (qué falta, dónde y cómo resolverlo).
3. **Recibe retroalimentación específica y creíble** (sin textos cruzados ni placeholders).
4. **La interfaz es consistente** (misma forma de avanzar en todo contenido).
5. **Es rápida y accesible** (sin caches obsoletas, navegable por teclado/lector, en móvil).

**Métricas objetivo (instrumentadas en Fase 0):**
| Métrica | Hoy (observado) | Objetivo |
|---|---|---|
| Dead-ends (pantallas sin acción siguiente) | ≥3 | **0** |
| Bloqueos sin mensaje accionable | varios | **0** |
| Textos rotos (i18n/placeholders) | ≥3 | **0** |
| Errores de consola por sesión (401/i18n) | 40–100+ | **<5** |
| Tareas de avance que requieren descubrir la mecánica | 5+ | **0** |
| Recursos no persistidos tras completarlos | ≥1 | **0** |

> Regla del plan: **cada tarea es aditiva** o corrige un bug con test. Ninguna cambia pesos, umbrales (80%) ni reglas de desbloqueo.

---

## Fase 0 — Baseline e instrumentación (sin cambios visibles)

### Task 0.1: Baseline de interacción (sin archivos nuevos)

**Files:**
- Modify: (ninguno) — medición manual/DOM en la consola del navegador; no se agrega código.

- [ ] **Step 1:** Registrar la línea base a mano (revisión QA): dead-ends, bloqueos sin mensaje, textos rotos y errores de consola por sesión.
- [ ] **Step 2:** Guardar el baseline en `docs/reports/informe-curso-ialab-2026-09.md` (anexo).

**Impacto:** medición sin tocar la app. **No crea archivos de producto.**

---

## Fase 1 — Quick wins de claridad y credibilidad (mayor salto, riesgo mínimo)

### Task 1.1: Arreglar placeholders e i18n rotos (H5, H6, H14)

**Files:**
- Modify: `edutechlife-frontend/src/i18n/es.json`, `en.json`, `pt.json`
- Modify: `edutechlife-frontend/src/components/IALab/IALabQuizModal.jsx` (usa `{score}`)
- Test: `edutechlife-frontend/src/i18n/__tests__/placeholders.test.js` (nuevo)

- [ ] **Step 1: Test que falla** — ningún string renderizable contiene `{` sin interpolar ni claves crudas `modals.*`

```js
import es from '../es.json';
test('no hay placeholders sin interpolar en strings de UI', () => {
  const bad = Object.entries(es).filter(([k, v]) =>
    typeof v === 'string' && /\{[a-z_]+\}/i.test(v) === false && v.includes('{') && !/[\w.]+\s*\|/.test(v));
  expect(bad).toEqual([]);
});
```

- [ ] **Step 2: Run test → FAIL**`npm run test -- placeholders`
- [ ] **Step 3: Corregir** el resultado de “Mi reto” para usar el valor real (80) y tomar el texto de feedback **según el módulo** (mapa por `moduleId`, sin reusar el del M1).
- [ ] **Step 4: RUN PASS** y verificar visualmente el resultado de Mi reto.
- [ ] **Step 5: Commit** `fix(i18n): feedback por módulo y sin placeholders`

**Impacto:** credibilidad inmediata (evita “la app está rota”). **No altera** notas.

### Task 1.2: Mensajes de bloqueo accionables (H17, H2)

**Files:**
- Modify: `edutechlife-frontend/src/components/IALab/module/ResourceItem.jsx:139-145`
- Modify: `edutechlife-frontend/src/i18n/*.json` (nueva clave `ialab.status.locked_detail`)

- [ ] **Step 1:** Reemplazar el hint por un mensaje con **nombre del recurso** y **acción**:

```jsx
{resourceLocked && (
  <p className="text-[10px] text-slate-400 mt-0.5">
    {prevResourceTitle
      ? t('ialab.status.locked_detail', { name: prevResourceTitle })
      : t('ialab.status.locked_hint')}
  </p>
)}
```
- [ ] **Step 2:** `ialab.status.locked_detail` = `Termina "{name}" para desbloquear este recurso`.
- [ ] **Step 3: Verificación manual:** confirmar que el texto muestra el nombre real.
- [ ] **Step 4: Commit** `feat(ux): mensajes de bloqueo con recurso faltante`

**Impacto:** elimina el dead-end “no sé qué falta”. **No altera** reglas.

### Task 1.3: Título dinámico por ruta (H15)

**Files:** Modify `edutechlife-frontend/src/components/SEO.jsx` (o `main.jsx`)

- [ ] **Step 1:** Setear `document.title` según sección (IALab módulo N, Actividades, Certificado).
- [ ] **Step 2:** Verificar en pestaña tras login.
- [ ] **Step 3: Commit** `fix(seo): titulo dinamico en IALab`

---

## Fase 2 — Consistencia de interacción (la fricción #1)

### Task 2.1: Consistencia de avance usando los BOTONES YA EXISTENTES (sin componentes nuevos)

**Files:**
- Modify (solo textos/handlers/estilos de lo existente): `ResourceViewerModal/OVAViewer.jsx`, `ResourceViewerModal/ovaComponents.jsx`, y las OVAs `OVANotebookPodcastGuide.jsx`, `OVARiskSimulator.jsx`, `OVABiasLab.jsx`, `OVADocumentMastery.jsx`.

- [ ] **Step 1:** En los botones “Siguiente/Continuar” **ya presentes** en cada visor, unificar el handler y añadir un **hint contextual en el texto del mismo botón** o junto a él (p. ej. “Continuar (haz clic)”, “Continuar (gira la ruleta)”).
- [ ] **Step 2:** Asegurar que el teclado (`ArrowRight`/`Enter`) dispare **el mismo handler** del botón existente (no crear controles nuevos).
- [ ] **Step 3:** Verificación: recorrer una OVA de cada tipo y confirmar que **el botón ya instalado** avanza de forma consistente.
- [ ] **Step 4: Commit** `fix(ux): avance consistente reusando los botones existentes de las OVAs`

**Impacto:** elimina la carga de “descubrir cómo avanza” sin agregar UI. **No cambia** contenido ni puntajes.

### Task 2.2: Indicador de “por qué no me deja” en Desafío/Mi reto

**Files:** Modify `IALabEvaluationModal/index.jsx` (paso bloqueado) + i18n

- [ ] **Step 1:** Mostrar checklist de requisitos del paso antes de enviar (medida, plazo, matriz, etc.) marcando lo cumplido.
- [ ] **Step 2:** Deshabilitar “Enviar” con tooltip que liste lo faltante (hoy ya deshabilita; falta el *por qué*).
- [ ] **Step 3: Commit** `feat(ux): requisitos visibles antes de enviar evaluacion`

**Impacto:** sube la tasa de aprobación a la primera (menos intentos consumidos).

### Task 2.3: Estados de carga y vacío consistentes (reusando lo existente)

**Files:** Modify `IALabSkeleton.jsx`, `PremiumSkeleton.jsx` y los textos de vacío ya presentes en Comunidad/Guardados/Progreso.

- [ ] **Step 1:** Reusar los skeletons existentes en las secciones que hoy no los muestran (mismos componentes, sin crear nuevos).
- [ ] **Step 2:** Ajustar el **texto** de los empty states ya instalados para que incluyan una acción clara (sin agregar controles nuevos).
- [ ] **Step 3: Commit** `fix(ux): carga y vacios consistentes con los componentes existentes`

---

## Fase 3 — Confiabilidad de la progresión (restaura comportamiento previsto)

### Task 3.1: Resetear flags de modales al cerrar (H7)

**Files:** Modify `edutechlife-frontend/src/components/IALab/IALabModals.jsx`; `store/slices/uiSlice.js`

- [ ] **Step 1: Test** (store): al llamar `closeAllModals()` todos los flags quedan `false`.
- [ ] **Step 2: Implementar** `closeAllModals()` y llamarlo en `onClose`/al cambiar de tab.
- [ ] **Step 3: Reproducir** el bug (fallar Mi reto → “Reintentar reto”) y confirmar que ahora abre el destino correcto.
- [ ] **Step 4: Commit** `fix(modales): resetear flags al cerrar para evitar cruces`

### Task 3.2: Respetar la URL del módulo (H8)

**Files:** Modify `IALab.jsx:288-298` (efecto store→URL)

- [ ] **Step 1:** No navegar si `urlMod` ya es válido y difiere solo por “último visitado”.
- [ ] **Step 2:** Verificar `/ialab/3` carga el módulo 3.
- [ ] **Step 3: Commit** `fix(nav): no sobrescribir la URL con el ultimo modulo`

### Task 3.3: Persistencia confiable del marcado de recursos (H11)

**Files:** Modify `OVANotebookPodcastGuide.jsx` (y patrón general), `ResourceViewerModal/index.jsx`

- [ ] **Step 1: Test** (unit): al llegar a la pantalla final, `onComplete` se invoca una vez.
- [ ] **Step 2:** Permitir marcar completado al alcanzar la pantalla final **aunque el score <100** (mantener el score como dato, no como bloqueo de progreso).
- [ ] **Step 3:** Verificar que el siguiente recurso se desbloquea tras completar.
- [ ] **Step 4: Commit** `fix(ova): persistir finalizacion de OVA tipo curso`

### Task 3.4: Conteo de recursos por módulo (H12)

**Files:** Modify `constants/ialab.js` (`collectResourceIdsByModule`) + test

- [ ] **Step 1: Test** que `MODULE_RESOURCE_COUNTS[5]` iguale el total real del catálogo.
- [ ] **Step 2:** Corregir derivación (claves por título, no indexadas).
- [ ] **Step 3: Commit** `fix(progreso): conteo real de recursos por modulo`

### Task 3.5: Número de certificado único (H13)

**Files:** Backend (Supabase/edge) + `useIALabUI.js` + `CertificatePreview.jsx`

- [ ] **Step 1: Migración SQL** con secuencia: `ALTER TABLE certificates ADD COLUMN cert_number text UNIQUE;` y trigger que asigne `EDL-<año>-<secuencia>`.
- [ ] **Step 2:** La vista usa `cert_number` real; la URL de verificación resuelve.
- [ ] **Step 3: Commit** `feat(certificado): numero unico y verificable`

---

## Fase 4 — Confianza, rendimiento y accesibilidad

### Task 4.1: Estrategia de actualización PWA (H19)

**Files:** Modify `vite.config.*` (Workbox)

- [ ] **Step 1:** `skipWaiting: true`, `clientsClaim: true`, y aviso “Nueva versión disponible, recargar”.
- [ ] **Step 2:** Verificar que tras un deploy no se sirve JS viejo.
- [ ] **Step 3: Commit** `fix(pwa): actualizacion automatica de service worker`

### Task 4.2: Manejo de sesión/JWT (H16)

**Files:** Modify client de Supabase / interceptor

- [ ] **Step 1:** Reintento único con `refreshSession()` ante 401.
- [ ] **Step 2:** Verificar que se eliminan los 401 intermitentes.
- [ ] **Step 3: Commit** `fix(auth): refresh de sesion ante 401`

### Task 4.3: Accesibilidad de OVAs (teclado/lector)

**Files:** Modify `ResourceViewerModal/*`, `shared/ContinueBar.jsx`

- [ ] **Step 1:** Foco visible, roles, `aria-live` en cambios de paso, navegación por `Enter/Espacio` además de `ArrowRight`.
- [ ] **Step 2:** Correr auditoría a11y existente (`npm run test -- a11y`).
- [ ] **Step 3: Commit** `feat(a11y): navegacion por teclado en OVAs`

### Task 4.4: Performance percibida

**Files:** Modify rutas con lazy, imágenes de recursos

- [ ] **Step 1:** Precarga de la siguiente lección/OVA; `loading="lazy"` en imágenes.
- [ ] **Step 2:** Medir LCP/INP antes/después.
- [ ] **Step 3: Commit** `perf(ialab): precarga y lazy de recursos`

---

## Fase 5 — Delight (experiencia >9, no solo sin fricción)

### Task 5.1: Micro-momentos y refuerzo positivo

**Files:** `useCelebrationEffects.js`, `XPToast.jsx`, `AchievementToast.jsx`

- [ ] **Step 1:** Confirmación al marcar recurso (“+XP”), racha y progreso animado.
- [ ] **Step 2: Commit** `feat(ux): micro-momentos de refuerzo`

### Task 5.2: Rúbrica visible y recomendaciones

**Files:** `IALabEvaluationModal`, `AdaptiveRecommendations.jsx`

- [ ] **Step 1:** Mostrar la rúbrica (qué y cuánto pesa) **antes** de enviar y sugerir repaso por módulo.
- [ ] **Step 2: Commit** `feat(ux): rubrica y recomendaciones personalizadas`

### Task 5.3: Certificado impecable (logos reales)

**Files:** `CertificatePreview.jsx`, `public/images/`

- [ ] **Step 1:** Integrar logos SVG/PNG oficiales (TIC, Alcaldía) y usar fuentes si están licenciadas.
- [ ] **Step 2: Commit** `feat(certificado): logos oficiales`

---

## Self-review (cobertura vs hallazgos)

- H2 → Task 1.2/3.1 · H5 → 1.1 · H6 → 1.1 · H7 → 3.1 · H8 → 3.2 · H9 → 5.2 (etiquetar) · H10 → 5.2/validación · H11 → 3.3 · H12 → 3.4 · H13 → 3.5 · H14 → 1.1 · H15 → 1.3 · H16 → 4.2 · H17 → 1.2 · H18 → 5.3 · H19 → 4.1.
- Sin placeholders pendientes. Tipos y rutas consistentes.

## Proyección de impacto

| Fase | Score esperado | Riesgo |
|---|---|---|
| Baseline | 6.0 | — |
| Fase 1 | **7.5** | Muy bajo (solo copy/i18n) |
| Fase 2 | **8.5** | Bajo (UI aditiva) |
| Fase 3 | **9.0** | Medio (correcciones de bugs con test) |
| Fase 4–5 | **9.5+** | Bajo |

**Regla de oro:** cada fase se despliega y se verifica con las métricas de Fase 0 antes de pasar a la siguiente.
