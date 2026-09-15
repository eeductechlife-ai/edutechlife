# Diseño — Nomenclatura iLAB: módulos, OVA y metodologías

- **Fecha:** 2026-09-15
- **Estado:** Aprobado (sistema híbrido narrativo) — pendiente revisión final del spec
- **Owner:** Edutechlife — iLAB Academic
- **Alcance:** Capa de nombres visibles + trazabilidad técnica de los OVA del curso "Introducción a la Inteligencia Artificial Generativa".

---

## 1. Contexto y problema

Los Objetos Virtuales de Aprendizaje (OVA) del curso no tienen una nomenclatura única. Hoy conviven **cuatro capas de nombres** para el mismo recurso y, en la práctica, el nombre visible no coincide con el nombre del componente, ni con el namespace i18n, ni con el catálogo.

Ejemplo real del mismo recurso:

| Capa | Valor actual |
|---|---|
| ID de recurso | `notebooklm-ova-1` |
| Componente | `OVANotebookLab.jsx` |
| Namespace i18n | `ova.notebooklab` |
| Título visible (recursos) | "Laboratorio: Crea tu Notebook" |
| Título de catálogo | "NotebookLM Lab" |
| Título de bienvenida i18n | "Desafío: El Cuaderno del Futuro" |

### 1.1 Evidencia de la auditoría

- **10 patrones de nombre** distintos: `Laboratorio:`, `Simulador:`, `Misión Interactiva:`, `Casos Prácticos de`, `Dominio del…`, nombre desnudo, etc.
- **Mezcla de idiomas** en títulos visibles/datos en español: `Build Your GPT`, `ChatGPT Tools`, `Bias Lab`, `Podcast Studio`, `NotebookLM Lab`.
- **Catálogo desactualizado** (`ovaData.js`): faltan 4 OVA reales (`prompt-lab-ova-1`, `automation-flows-ova-1`, `ethics-cases-ova-1`, `document-mastery-ova-1`).
- **OVA huérfano:** `OVAGeminiDeepResearch.jsx` sin ID, sin i18n, solo referenciado por `PracticeToolModal.jsx`.
- **Mapeo muerto:** `gemini-ova-1 → InteractiveViewer` sin recurso que lo use.
- **Errores de estilo:** `"Notebook LM"`, `"Laboratorio: dilemas Éticos"` (minúscula), `"Etica de la Inteligencia artificial"` (tildes/mayúscula).
- **i18n divergente:** `ova.risksim.title` = "Ética de la Inteligencia Artificial" para el recurso "Simulador: Evaluación de Riesgos".
- **Desalineación curricular:** `intro-ova-1` (ética, `OVAEtica`) vive en **M1**; la ética es **M5**.
- **Módulos sin rol:** M3 y M5 en `MODULE_NAMES` no siguen el patrón "El [Rol] — [Tema]" de M1/M2/M4.

---

## 2. Objetivos y no-objetivos

### Objetivos

1. Un **sistema de nomenclatura de 4 capas** con trazabilidad total.
2. Un **nombre propio + descriptor + principio rector** por OVA (20: 19 existentes + 1 nuevo), por módulo (5) y por metodología (7).
3. Corregir las inconsistencias detectadas (ética en M5, huérfanos, catálogo, idioma, estilo).
4. Reglas de gobernanza para nombrar OVA futuros.

### No-objetivos (por ahora)

- No se renombran **IDs de recurso** existentes (evita romper analítica, bookmarks y enlaces).
- No se renombran **archivos de componentes** (churn de código); se documenta el mapeo. Queda como Fase 2 opcional.

---

## 3. Sistema de nomenclatura (4 capas)

| Capa | Formato | Uso | Ejemplo |
|---|---|---|---|
| **1. Código canónico** | `ILAB-M#-OVA#` + slug ASCII | Código, analítica, QA, soporte | `ILAB-M1-OVA2-el-cincel` |
| **2. Nombre propio** | 2–4 palabras, español, del universo del rol | Marca y comunicación | **El Cincel** |
| **3. Descriptor funcional** | `Acción/Sustantivo + Objeto`, sentence case, sin dos puntos | Subtítulo explicativo | *Fundamentos del prompt y su anatomía* |
| **4. Principio rector** | 1–2 palabras | Valor pedagógico que encarna | *Claridad* |

### Reglas de gobernanza

- **R1.** Todo OVA tiene un código canónico `ILAB-M#-OVA#`.
- **R2.** El nombre propio es único en todo el curso y pertenece al universo narrativo de su módulo.
- **R3.** El descriptor no repite el nombre propio ni usa dos puntos.
- **R4.** Cada OVA y cada módulo declaran **un** principio rector.
- **R5.** El nombre propio se localiza (ES/EN/PT); el código **no** se traduce.
- **R6.** Prohibido mezclar idiomas en el título visible.
- **R7.** Los subcomponentes de UI (no evaluables) **no** llevan nombre de marca.
- **R8.** Todo OVA nuevo debe registrarse en **3 lugares**: `ovaData.js` (catálogo), `ResourceViewerModal/ovaComponents.jsx` (render) y `resourcesEs/En/Pt.js` (recursos).

### i18n

- El nombre propio se traduce; el descriptor también; el código permanece.
- Se añaden claves nuevas y se **deprecan** (no se borran de inmediato) las antiguas para no romper pantallas existentes.

---

## 4. Nombres por módulo + principio

| Módulo | Nombre oficial | Tema | Principio rector |
|---|---|---|---|
| M1 | **El Artesano Digital** | Ingeniería de Prompts | *Precisión* — una instrucción precisa transforma el resultado |
| M2 | **El Arquitecto de Automatización** | ChatGPT | *Estructura* — lo que se diseña bien se automatiza mejor |
| M3 | **El Detective de Datos** | Gemini | *Evidencia* — solo lo verificado es conocimiento |
| M4 | **El Alquimista del Conocimiento** | NotebookLM | *Síntesis* — todo documento puede transmutarse en conocimiento |
| M5 | **El Guardián de la IA** | Ética y gobernanza | *Responsabilidad* — el poder sin ética es riesgo |

> Corrige la inconsistencia de `MODULE_NAMES`, donde M3 y M5 no tenían rol narrativo.

---

## 5. Nombres por OVA + principio

### M1 · El Artesano Digital — *Precisión*

| Código | Nombre propio | Descriptor | Principio | Estado |
|---|---|---|---|---|
| `ILAB-M1-OVA1` | **Los Orígenes** | Historia de la IA, de Turing a ChatGPT | *Contexto* | Nuevo (reutiliza el video introductorio) |
| `ILAB-M1-OVA2` | **El Cincel** | Fundamentos del prompt y su anatomía | *Claridad* | Renombrado |
| `ILAB-M1-OVA3` | **El Banco de Forja** | Laboratorio de prompts en vivo | *Práctica deliberada* | Renombrado |

### M2 · El Arquitecto de Automatización — *Estructura*

| Código | Nombre propio | Descriptor | Principio | Estado |
|---|---|---|---|---|
| `ILAB-M2-OVA1` | **El Plano Maestro** | Mapa del ecosistema ChatGPT | *Visión sistémica* | Renombrado |
| `ILAB-M2-OVA2` | **La Caja de Herramientas** | Arsenal integrado de ChatGPT | *Herramienta correcta* | Renombrado |
| `ILAB-M2-OVA3` | **La Línea de Montaje** | Flujos de automatización | *Eficiencia* | Renombrado |
| `ILAB-M2-OVA4` | **La Fábrica de Asistentes** | Construye tu GPT | *Personalización* | Renombrado |

### M3 · El Detective de Datos — *Evidencia*

| Código | Nombre propio | Descriptor | Principio | Estado |
|---|---|---|---|---|
| `ILAB-M3-OVA1` | **La Lupa Multimodal** | Misión Gemini | *Observación* | Renombrado |
| `ILAB-M3-OVA2` | **El Caso Abierto** | Casos prácticos con Gemini | *Aplicación* | Renombrado |
| `ILAB-M3-OVA3` | **El Archivo Forense** | Investigación profunda y verificación | *Verificación* | Integrar huérfano |

### M4 · El Alquimista del Conocimiento — *Síntesis*

| Código | Nombre propio | Descriptor | Principio | Estado |
|---|---|---|---|---|
| `ILAB-M4-OVA1` | **El Grimorio** | Construye tu notebook inteligente | *Curaduría* | Renombrado |
| `ILAB-M4-OVA2` | **El Crisol** | Simulador de análisis documental | *Síntesis* | Renombrado |
| `ILAB-M4-OVA3` | **La Fórmula Sonora** | Guía de Audio Overviews | *Divulgación* | Renombrado |
| `ILAB-M4-OVA4` | **El Estudio Alquímico** | Crea tu podcast IA | *Creación* | Renombrado |
| `ILAB-M4-OVA5` | **La Transmutación** | Del documento al podcast | *Transformación* | Renombrado |

### M5 · El Guardián de la IA — *Responsabilidad*

| Código | Nombre propio | Descriptor | Principio | Estado |
|---|---|---|---|---|
| `ILAB-M5-OVA1` | **El Juramento** | Los 4 principios éticos | *Transparencia* | Reubicado desde M1 |
| `ILAB-M5-OVA2` | **El Espejo de la Verdad** | Detector de sesgos | *Equidad* | Renombrado |
| `ILAB-M5-OVA3` | **La Brújula de Riesgos** | Privacidad y evaluación de riesgos | *Prudencia* | Renombrado |
| `ILAB-M5-OVA4` | **El Tribunal Ético** | Dilemas éticos | *Juicio* | Renombrado |
| `ILAB-M5-OVA5` | **Casos del Guardián** | Ética aplicada al mundo real | *Consecuencia* | Renombrado |

---

## 6. Nombres por metodología + principio

| Metodología actual | Nombre propio | Principio rector |
|---|---|---|
| VAK (Visual, Auditivo, Kinestésico) | **Brújula VAK** | *Personalización* — cada mente aprende distinto |
| STEAM | **Enfoque STEAM** | *Integración* — ciencia, arte y tecnología juntas |
| Aprendizaje basado en retos | **Método Reto** | *Aplicación* — se aprende resolviendo |
| Neurociencia cognitiva | **Diseño Neurocognitivo** | *Retención* — micro-lecciones y repaso espaciado |
| Tutor IA | **Acompañamiento MAX** | *Acompañamiento* — nunca aprendes solo |
| Gamificación | **Motor de Progreso** | *Motivación* — el avance visible sostiene el hábito |
| Método Edutechlife (4 pasos) | **Ruta Edutechlife** | *Progresión* — diagnóstico → ruta → práctica → certificación |

---

## 7. Matriz de trazabilidad (antes → después)

| # | Código nuevo | Nombre propio | ID de recurso (estable) | Componente actual | Namespace i18n | Antes (título visible) |
|---|---|---|---|---|---|---|
| 1 | `ILAB-M1-OVA1` | Los Orígenes | *(nuevo)* | *(reutiliza video)* | *(nuevo)* | — |
| 2 | `ILAB-M1-OVA2` | El Cincel | `prompt-ova-html-1` | `OVAIntroPrompt` | `ova.introprompt` | Cómo comunicarte con la IA (prompts) |
| 3 | `ILAB-M1-OVA3` | El Banco de Forja | `prompt-lab-ova-1` | `OVAPromptLab` | `ova.promptlab` | Laboratorio de Prompts en Vivo |
| 4 | `ILAB-M2-OVA1` | El Plano Maestro | `chatgpt-ova-ecosystem` | `OVAEcosystemGuide` | `ova.ecosystem` | Explora el Ecosistema ChatGPT |
| 5 | `ILAB-M2-OVA2` | La Caja de Herramientas | `workflow-ova-herramientas` | `OVAChatGPTTools` | `ova.chatgpttools` | Laboratorio: Herramientas ChatGPT |
| 6 | `ILAB-M2-OVA3` | La Línea de Montaje | `automation-flows-ova-1` | `OVAAutomationFlows` | `ova.automation` | Flujos de Automatización en el Mundo Real |
| 7 | `ILAB-M2-OVA4` | La Fábrica de Asistentes | `gpts-ova-1` | `OVABuildGPT` | `ova.buildgpt` | Laboratorio: Construye un GPT |
| 8 | `ILAB-M3-OVA1` | La Lupa Multimodal | `workspace-ova-1` | `OvaEdutechlife` | `ova.tour` / `ova.gemini` | Misión Interactiva: Domina el Ecosistema Gemini |
| 9 | `ILAB-M3-OVA2` | El Caso Abierto | `gemini-cases-ova-1` | `OVAPracticalCases` | `ova.practical` | Laboratorio: Resuelve el Caso — 6 Desafíos |
| 10 | `ILAB-M3-OVA3` | El Archivo Forense | *(nuevo)* `gemini-deep-research-ova-1` | `OVAGeminiDeepResearch` | *(nuevo)* | — (huérfano) |
| 11 | `ILAB-M4-OVA1` | El Grimorio | `notebooklm-ova-1` | `OVANotebookLab` | `ova.notebooklab` | Laboratorio: Crea tu Notebook |
| 12 | `ILAB-M4-OVA2` | El Crisol | `notebook-summary-ova-1` | `OVANotebookSimulator` | `ova.notebooksim` | Simulador: Análisis de Documentos |
| 13 | `ILAB-M4-OVA3` | La Fórmula Sonora | `notebook-audio-guide-1` | `OVANotebookPodcastGuide` | `ova.podcastguide` | Notebook LM |
| 14 | `ILAB-M4-OVA4` | El Estudio Alquímico | `notebook-audio-ova-1` | `OVAPodcastStudio` | `ova.podcaststudio` | Laboratorio: Crea tu Podcast IA |
| 15 | `ILAB-M4-OVA5` | La Transmutación | `document-mastery-ova-1` | `OVADocumentMastery` | `ova.docmastery` | Dominio del Documento: Del Papel al Podcast |
| 16 | `ILAB-M5-OVA1` | El Juramento | `intro-ova-1` *(reubicado)* | `OVAEtica` | `ova.etica` *(nuevo)* | Comienzos de la Inteligencia Artificial |
| 17 | `ILAB-M5-OVA2` | El Espejo de la Verdad | `bias-ova-1` | `OVABiasLab` | `ova.biaslab` | Laboratorio: Detecta el Sesgo |
| 18 | `ILAB-M5-OVA3` | La Brújula de Riesgos | `privacy-ova-1` | `OVARiskSimulator` | `ova.risksim` | Simulador: Evaluación de Riesgos |
| 19 | `ILAB-M5-OVA4` | El Tribunal Ético | `ethics-ova-1` | `OVAEthicalDilemmas` | `ova.ethical_dilemmas` | Laboratorio: dilemas Éticos |
| 20 | `ILAB-M5-OVA5` | Casos del Guardián | `ethics-cases-ova-1` | `OVAEthicsCases` | `ova.ethicscases` | Casos Prácticos de Ética Aplicada |

### Subcomponentes de UI (sin marca)

| Archivo | Función | Regla |
|---|---|---|
| `PromptSandbox.jsx` | Entorno de práctica de prompts | Soporte de `El Banco de Forja` |
| `EthicsExplorer.jsx` | Explorador de casos éticos | Soporte de `Casos del Guardián` |
| `OVANotebookBase.jsx` | Base compartida de NotebookLM | Soporte de `El Grimorio` y `El Crisol` |
| `OVAThumbnail.jsx` | Miniatura de UI | No es OVA |

---

## 8. Cambios y decisiones

| # | Decisión | Detalle |
|---|---|---|
| D1 | Reubicar ética a M5 | `intro-ova-1` / `OVAEtica` pasa a `ILAB-M5-OVA1` "El Juramento". |
| D2 | M1 recupera su OVA inicial | Se crea/renombra "Los Orígenes" reutilizando el video "Qué es la IA y cómo está cambiando el mundo". |
| D3 | Integrar el huérfano | `OVAGeminiDeepResearch` se registra con ID `gemini-deep-research-ova-1` como `ILAB-M3-OVA3` "El Archivo Forense". |
| D4 | Catálogo al día | Añadir a `ovaData.js` los 4 OVA faltantes + el huérfano (5 en total). |
| D5 | Retirar mapeo muerto | Eliminar `gemini-ova-1 → InteractiveViewer` o crear su recurso. |
| D6 | IDs estables | No renombrar IDs existentes; solo añadir los nuevos. |
| D7 | Componentes intactos | Renombrar archivos de componentes queda como Fase 2 opcional. |
| D8 | Idioma único visible | Todo título visible en español; el código en ASCII. |

---

## 9. Gobernanza y verificación

### Checklist de aceptación

- [ ] 20 OVA con código `ILAB-M#-OVA#`, nombre propio, descriptor y principio.
- [ ] 5 módulos con rol narrativo unificado y principio.
- [ ] 7 metodologías con nombre propio y principio.
- [ ] Trazabilidad 1:1 entre las 4 capas (código, componente, ID, i18n).
- [ ] 0 títulos con idioma mezclado; 0 duplicados de nombre.
- [ ] Ética consolidada en M5; M1 con "Los Orígenes".
- [ ] Huérfano y mapeo muerto resueltos.
- [ ] `resourcesEs/En/Pt.js`, `ovaData.js` y `ovaComponents.jsx` consistentes.

### Criterios de estilo de nombre

- Nombre propio: sustantivo con artículo definido (`El/La`) o sintagma corto.
- Descriptor: sin dos puntos, sin emojis, sentence case.
- Sin siglas en inglés en el título visible.

---

## 10. Decisiones abiertas

1. ¿"Los Orígenes" se construye como OVA nuevo o se retira el primer OVA de M1?
2. ¿Se renombran los archivos de componentes en Fase 2 (implica actualizar imports y `ovaComponents.jsx`)?
3. ¿Se conservan las claves i18n antiguas como alias o se migran por completo?
4. ¿Se traducen los nombres propios (localización) o se mantienen en español en EN/PT?

---

## 11. Próximos pasos

1. Revisión de este spec por el usuario.
2. Plan de implementación (skill `writing-plans`) que cubra: renombrado de títulos visibles, alineación i18n, actualización de `ovaData.js`, registro del huérfano, reubicación de ética y limpieza del mapeo muerto.
3. Ejecución por fases con verificación en cada una.

---

## 12. Estado de implementación (2026-09-15)

Ejecutado con subagentes (implementador + revisión) sobre el árbol de trabajo actual. **Sin commits** (política del repo).

**Resultado verificado:**
- Registro canónico: **19 OVA, todos activos (0 planificados)**. **Corrección importante:** `intro-ova-1` (`OVAEtica`) resultó ser un OVA de orígenes de la IA + ingeniería de prompts (no de ética), por lo que se **reubicó al Módulo 1** como **"La Materia Prima"**; se eliminó "El Juramento" y M5 quedó con 4 OVA. El huérfano `OVAGeminiDeepResearch` se **conectó** como "El Archivo Forense" (M3).
- **M1 El Artesano Digital:** La Materia Prima · El Cincel · El Martillo.
- **M5 El Guardián de la IA:** El Espejo de la Verdad · La Brújula de Riesgos · El Tribunal Ético · Casos del Guardián.
- 54 títulos (18 OVA × ES/EN/PT) reescritos en `resourcesEs/En/Pt.js` (script idempotente `scripts/apply-ova-names.mjs`).
- `ovaData.js`: catálogo de 18 + `MODULE_NAMES` con rol narrativo en M3/M5.
- `ovaComponents.jsx`: eliminado el mapeo muerto `gemini-ova-1`.
- `iconMapping.jsx`: añadidos `fa-hammer`, `fa-arrows-spin`, `fa-scale-balanced`, `fa-gavel`.
- i18n: 9 valores corregidos (3 claves × 3 idiomas).
- `courseKnowledge.js` / `courseKnowledgePt.js`: 14 títulos alineados cada uno.

**Verificación:** tests IALab **197/197** en `__tests__/` (25 archivos, incluidos 4 nuevos), consistencia de 4 capas **0 desajustes** (19 activos ↔ recursos ↔ catálogo ↔ render), lint **0 errores**, `build:fast` **OK**. `i18n:validate` falla por claves faltantes **preexistentes** ajenas a este cambio (`parent_dashboard.controls_*`, `ialab.*.exam`); las claves modificadas están correctas.

**Pendiente (Fase 2):** construir el OVA planificado "Los Orígenes" (M1) y renombrar archivos de componentes (opcional).
