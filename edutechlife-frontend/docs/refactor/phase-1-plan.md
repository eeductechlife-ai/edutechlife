# Fase 1 — Plan de Extracción: Desmontaje de God-Components

Autor: Atlas (Architecture Lead) · Rama: `phase-1/foundations` · Solo análisis, sin cambios de código en esta iteración.

## Objetivo

Reducir tres god-components a archivos < 500 líneas cada uno, moviendo sub-componentes presentacionales, hooks, constantes y helpers puros a archivos propios, **sin cambiar el comportamiento**. Este documento es la guía de ejecución para Forge (implementador).

## Regla de oro (aplica a TODAS las extracciones)

1. **Cero cambios de comportamiento.** Cortar y pegar, no reescribir. Si una función necesita cambiar de firma para recibir props explícitas, la lógica interna se copia literal.
2. **Preservar el estilo del archivo original**: mismo formato de imports, mismas convenciones de nombres, mismos patrones (`memo`, `displayName`, Tailwind inline, etc.) ya presentes en el codebase.
3. **Verificar en navegador después de CADA extracción individual** (no acumular varias extracciones antes de probar). Abrir el flujo real (chat de Dani, widget de Nico, diagnóstico VAK) y confirmar que se ve y funciona igual que antes del cambio.
4. **Un commit por extracción** (o por grupo pequeño y cohesivo), con mensaje que indique qué se movió y a dónde. Así cualquier regresión es fácil de aislar con `git bisect`.
5. **No tocar lógica de negocio** dentro de los componentes que quedan — solo mover código, actualizar imports y quitar el código movido del archivo original.
6. Si una extracción requiere pasar más de ~8 props, es señal de que el seam no es tan limpio como parece — pausar y confirmar con Atlas antes de continuar.

---

## Resumen de riesgo/esfuerzo

| Componente | Líneas | Riesgo | Esfuerzo | Orden recomendado |
|---|---|---|---|---|
| `DaniTutorChat.jsx` | 1.574 | **Bajo** | Bajo | 1º — probar el patrón aquí |
| `NicoModern.jsx` | 2.306 | Medio | Medio-Alto | 2º |
| `DiagnosticoVAK.jsx` | 3.054 | **Alto** | Alto | 3º — solo seams seguros en Fase 1 |

Justificación: `DaniTutorChat` ya tiene sub-componentes `memo` autocontenidos y funciones puras aisladas — es prácticamente "cortar y pegar" con riesgo mínimo. `NicoModern` tiene ~600 líneas de funciones puras de módulo (buen seam) pero su componente principal tiene un `handleSendMessage` de ~440 líneas con mucho estado entrelazado (no tocar). `DiagnosticoVAK` ya tiene un patrón de extracción parcial en curso (`vakStyles.js`, `vakHelpers.js`, `vakComponents.jsx`) pero el cuerpo del componente usa funciones `render*` como closures que capturan ~30+ variables de estado — extraerlas a archivos propios exige prop-drilling extenso y es donde más fácil se rompe algo.

---

## 1. `DaniTutorChat.jsx` (1.574 líneas) — EMPEZAR AQUÍ

Ubicación actual: `src/components/kids-dashboard/DaniTutorChat.jsx`
Nueva carpeta: `src/components/kids-dashboard/dani/`

> Nota de naming: ya existe `src/components/kids-dashboard/DaniAvatar3D.jsx` (componente distinto, avatar 3D). Usar nombres específicos dentro de `dani/` para evitar confusión (ver tabla).

### Estructura actual (líneas aprox.)
- 1–31: imports
- 36–44: `DaniAvatar` (memo, presentacional puro)
- 46–53: `COLORS` (constante, usada por `ChartRenderer`)
- 55–160: `ChartRenderer` (memo, bar/pie/line con recharts)
- 162–211: `VideoEmbed` (memo, embed YouTube)
- 216–257: `MessageBubble` (memo, burbuja de chat)
- 262–298: `QuickActions` (memo, botones de acciones rápidas)
- 303–326: `RecentTopics` (memo, chips de temas recientes)
- 331–370: `inferMoodFromText` (función pura)
- 372–385: `getRelativeTime` (función pura)
- 390–507: `SUBJECT_KEYWORDS` (constante) + `extractTopic` (función pura, 509–517)
- 522–1574: `DaniTutorChat` (componente principal — se queda, ~450 líneas de lógica + JSX de shell tras la extracción)

Todos los sub-componentes son `memo(...)` con `displayName` ya asignado, reciben solo props (no leen contexto ni estado externo) → **extracción de bajo riesgo, sin necesidad de prop-drilling nuevo**.

### Archivos nuevos y qué contienen

1. `dani/DaniAvatar.jsx`
   - Mueve: `DaniAvatar` (líneas 36–44).
   - Imports que necesita: `memo` de React, `tutorAvatars`/`DEFAULT_AVATAR` de `../../../data/tutorAvatars` (ajustar profundidad relativa).
   - Export: `export default DaniAvatar;` (o named, a elección — mantener consistente con el resto de la carpeta).

2. `dani/chartColors.js`
   - Mueve: `COLORS` (líneas 46–53).
   - Export: `export const COLORS = [...]`.

3. `dani/ChartRenderer.jsx`
   - Mueve: `ChartRenderer` (líneas 55–160).
   - Imports: `memo` de React, `motion` de `framer-motion`, componentes de `recharts` (`BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`, `PieChart`, `Pie`, `Cell`, `LineChart`, `Line`), `COLORS` desde `./chartColors`.
   - Props: `{ chartData, darkMode }` (sin cambios).

4. `dani/VideoEmbed.jsx`
   - Mueve: `VideoEmbed` (líneas 162–211).
   - Imports: `memo`, `useState` de React, `motion` de `framer-motion`.
   - Props: `{ videoData, darkMode }` (sin cambios).

5. `dani/MessageBubble.jsx`
   - Mueve: `MessageBubble` (líneas 216–257).
   - Depende de `getRelativeTime` → importar desde `./chatUtils` (ver punto 8).
   - Imports: `memo` de React, `motion` de `framer-motion`, `DaniAvatar` desde `./DaniAvatar`.
   - Props: `{ message, isDani, darkMode }` (sin cambios).

6. `dani/QuickActions.jsx`
   - Mueve: `QuickActions` (líneas 262–298), incluyendo el array `actions` interno (no se toca, ya está local a la función).
   - Imports: `memo` de React, `motion` de `framer-motion`.
   - Props: `{ onAction, darkMode }` (sin cambios).

7. `dani/RecentTopics.jsx`
   - Mueve: `RecentTopics` (líneas 303–326).
   - Imports: `memo` de React, `motion` de `framer-motion`.
   - Props: `{ topics, onTopicClick, darkMode }` (sin cambios).

8. `dani/chatUtils.js`
   - Mueve: `inferMoodFromText` (331–370), `getRelativeTime` (372–385), `SUBJECT_KEYWORDS` (390–507) y `extractTopic` (509–517).
   - Sin imports externos (funciones puras de string/fecha).
   - Exports nombrados: `inferMoodFromText`, `getRelativeTime`, `SUBJECT_KEYWORDS`, `extractTopic`.

### Cambios en `DaniTutorChat.jsx` (archivo original, tras extraer)
- Eliminar las 8 secciones movidas.
- Agregar imports:
  ```js
  import DaniAvatar from "./dani/DaniAvatar";
  import ChartRenderer from "./dani/ChartRenderer";
  import VideoEmbed from "./dani/VideoEmbed";
  import MessageBubble from "./dani/MessageBubble";
  import QuickActions from "./dani/QuickActions";
  import RecentTopics from "./dani/RecentTopics";
  import { inferMoodFromText, extractTopic } from "./dani/chatUtils";
  ```
- Quitar de los imports de recharts los que ya no se usan directamente en este archivo (quedan solo en `ChartRenderer.jsx`).
- El resto del componente principal (estado, `handleSendMessage`, `buildRichWelcome`, efectos, JSX de shell) **no se toca**.
- Resultado esperado: `DaniTutorChat.jsx` baja de 1.574 a ~600–650 líneas.

### Orden de ejecución sugerido (para minimizar riesgo de romper el diff)
1. Crear `dani/chartColors.js` y `dani/chatUtils.js` primero (sin dependencias de otros nuevos archivos).
2. Crear `dani/DaniAvatar.jsx`.
3. Crear `dani/ChartRenderer.jsx`, `dani/VideoEmbed.jsx`, `dani/QuickActions.jsx`, `dani/RecentTopics.jsx` (dependen solo de librerías externas).
4. Crear `dani/MessageBubble.jsx` (depende de `DaniAvatar` y `chatUtils`).
5. Actualizar `DaniTutorChat.jsx`: agregar imports nuevos, borrar código movido.
6. Verificar en navegador: abrir el chat de Dani, mandar un mensaje que dispare un chart (`<!CHART>`), un video (`<!VIDEO>`), probar quick actions y recent topics, confirmar que el layout y el comportamiento son idénticos.
7. Commit.

---

## 2. `NicoModern.jsx` (2.306 líneas)

Ubicación: `src/components/Nico/NicoModern.jsx`
Ya existen en la carpeta: `nicoConversation.js`, `nicoKnowledge.js`, más hooks externos ya extraídos (`useConversationMemory`, `useLeadManagement`, `useLeadCaptureLogic`, `useAppointmentScheduling`) y sub-componentes lazy (`LeadCaptureForm.jsx`, `AppointmentScheduler.jsx`). El patrón de extracción ya está validado en este archivo — Fase 1 lo continúa.

### Estructura actual
- 1–17: imports
- 18–618: **bloque de funciones/constantes puras de módulo** (el seam más limpio y grande del archivo):
  - `COLORS` (18–26)
  - `responseCache`, `CACHE_DURATION`, `CACHE_MAX_SIZE`, `setResponseCache` (27–38)
  - `removeEmojis` (39–118)
  - `removeGreetingMulletilla` (119–157)
  - `shouldAskForName` (158–174)
  - `useNameInResponse` (175–205) — **ojo**: el nombre empieza con "use" pero NO es un hook de React (no llama a `useState`/`useEffect`/etc.), es una función pura. Confirmado leyendo el cuerpo. Mantener el nombre igual al mover (no renombrar, para no tocar comportamiento ni arriesgar confusiones de lint de hooks — o, si Forge prefiere, renombrar a `applyNameInResponse` en el mismo commit que lo mueve, dejándolo explícito en el mensaje de commit).
  - `optimizeLongConversation` (206–233)
  - `extractUserContext` (234–330)
  - `getQuickResponse` (331–414)
  - `getQuestionSuggestions` (415–489)
  - `getConversationOptions` (490–563)
  - `getGreeting` (564–575)
  - `TRAINING` (576–583)
  - `PROMPT_NICO_SOPORTE` (584–619)
- 620–2306: componente `NicoModern` (se queda; sigue siendo grande, ver nota de riesgo abajo)

### Archivos nuevos y qué contienen

1. `Nico/nicoTextUtils.js`
   - Mueve: `removeEmojis`, `removeGreetingMulletilla`, `shouldAskForName`, `useNameInResponse` (o `applyNameInResponse`).
   - Sin dependencias externas (solo regex/string).

2. `Nico/nicoContext.js`
   - Mueve: `extractUserContext`, `getQuickResponse`, `getQuestionSuggestions`, `getConversationOptions`, `getGreeting`, `optimizeLongConversation`.
   - Verificar si alguna de estas usa `trainingData` (importado en línea 10) o `matchIntent` (línea 11) — si es así, ese import se mueve con ellas a este archivo en vez de quedar en `NicoModern.jsx`.

3. `Nico/nicoCache.js`
   - Mueve: `responseCache`, `CACHE_DURATION`, `CACHE_MAX_SIZE`, `setResponseCache`.
   - Exporta también un getter si `NicoModern.jsx` necesita leer `responseCache` directamente (confirmar con `grep -n "responseCache" NicoModern.jsx` antes de mover, para exportar exactamente lo que se usa fuera).

4. `Nico/nicoPrompts.js`
   - Mueve: `TRAINING`, `PROMPT_NICO_SOPORTE`.
   - `TRAINING` depende de `trainingData` (import de `../../data/nico-training-data.json`) — mover ese import también.

5. `Nico/nicoColors.js`
   - Mueve: `COLORS` (objeto de paleta, distinto del `COLORS` array de Dani — no colisionan por estar en carpetas distintas, pero cuidado si algún día se unifican imports).

### Cambios en `NicoModern.jsx`
- Reemplazar el bloque 18–619 por imports desde los 5 archivos nuevos.
- El componente principal (620–2306) se queda intacto en esta iteración.

### Extracción adicional opcional (marcar como Fase 2, NO ejecutar todavía)
Dentro del JSX del componente principal hay un bloque de renderizado de burbujas de mensaje (`messages.map(...)`, aprox. líneas 1889–2040 del archivo original) que es candidato a convertirse en `NicoMessageBubble.jsx`, pero a diferencia de `MessageBubble` de Dani, este bloque invoca handlers del componente padre (`showSchedulerWithContext`, `setMessage`, `handleSendMessage`, `inputRef`) — requiere pasar esos callbacks como props explícitas. Esfuerzo medio, riesgo medio. **Dejar para una iteración posterior**, después de validar el patrón con las extracciones puras de arriba.

### Orden de ejecución sugerido
1. `nicoColors.js` y `nicoCache.js` (sin dependencias cruzadas).
2. `nicoTextUtils.js`.
3. `nicoPrompts.js` (mover import de `trainingData` junto con `TRAINING`).
4. `nicoContext.js` (revisar dependencia de `matchIntent`/`trainingData` antes de mover).
5. Actualizar imports en `NicoModern.jsx`, borrar bloque movido.
6. Verificar en navegador: abrir el widget de Nico, mandar mensajes que disparen: respuesta rápida (`getQuickResponse`), sugerencias de preguntas, opciones de conversación, flujo de captura de lead y agendamiento de cita. Confirmar que el caché de respuestas sigue funcionando (repetir la misma pregunta y verificar que responde instantáneo).
7. Commit.

---

## 3. `DiagnosticoVAK.jsx` (3.054 líneas) — MÁS RIESGOSO, dejar para el final

Ubicación: `src/components/DiagnosticoVAK/DiagnosticoVAK.jsx` (136 KB)

Este archivo **ya tiene una extracción parcial en curso** hecha por el equipo:
- `vakStyles.js` (224 líneas) — `STYLE_MAP`, `getCaracteristicasEstilo`, `getTipsPadres`, `getCarrerasRecomendadas`, `getValentinaCommentary`.
- `vakHelpers.js` (44 líneas) — `MOOD_OPTIONS`, `buildResultsURL`, `getMoodLabel`, `getMoodFeedback`, `formatTime`, `validateEmail`.
- `vakComponents.jsx` (43 líneas) — `Confetti`, `Celebration` (presentacionales puros, patrón idéntico al que proponemos para Dani).
- `DiagnosticoVAK.css` (56 KB) — estilos, ya separado.

Fase 1 continúa este mismo patrón, **solo con los seams que no tocan el estado del componente principal**. NO se extraen las funciones `render*` en esta iteración (ver razón abajo).

### Seams seguros para Fase 1 (bajo riesgo, análogos a `vakComponents.jsx`)

1. `DiagnosticoVAK/ValeriaControls.jsx`
   - Mueve: `ValeriaControls` (líneas 34–102) y `EXPRESSION_CONFIG` (líneas 20–31, usado únicamente por `ValeriaControls`).
   - Es 100% presentacional: recibe `valeriaEnabled, setValeriaEnabled, valeriaVolume, setValeriaVolume, isSpeaking, valeriaExpression` como props, usa `useTranslation()` internamente (hook ya usado igual en el archivo original, sin cambio de comportamiento) y `tutorAvatars`/`DEFAULT_AVATAR`.
   - Imports a mover: `useTranslation` desde `../../i18n/I18nProvider`, `tutorAvatars`/`DEFAULT_AVATAR` desde `../../data/tutorAvatars`, `Volume`/`VolumeOff` desde `lucide-react`.

2. `DiagnosticoVAK/vakIcons.js`
   - Mueve: `getIconComponent` (líneas 104–129) y `SVG_ICONS` (líneas 131–138).
   - `getIconComponent` necesita todos los íconos de `lucide-react` que referencia en el `switch` (Eye, Video, Headphones, Activity, Sparkles, Rocket, Music, Volume, Wrench, ListOrdered, CheckSquare, Users, List, BookOpen, Mic, MessageCircle, Target, Zap, Globe, Cpu, Lightbulb) — mover esos imports específicos, dejando en `DiagnosticoVAK.jsx` solo los íconos que use directamente en su propio JSX (confirmar con grep cuáles se siguen usando allí tras la extracción, para no dejar imports muertos ni romper alguno que sí se necesite).
   - `SVG_ICONS` son strings de SVG crudo (probablemente usados en `generatePDF`/`renderDocumentPreview` para inyectar HTML) — mover tal cual, sin modificar el contenido de los strings.

### Cambios en `DiagnosticoVAK.jsx` tras este paso
- Reemplazar líneas 20–138 por:
  ```js
  import ValeriaControls from './ValeriaControls';
  import { getIconComponent, SVG_ICONS } from './vakIcons';
  ```
- El componente principal (línea 140 en adelante) no se toca en Fase 1.
- Reducción esperada: ~120 líneas menos (3.054 → ~2.930). Modesta, pero es el único seam de bajo riesgo verificado sin tocar el cuerpo del componente.

### Por qué NO se extraen los `render*` en Fase 1 (documentar la razón, no solo la decisión)

El componente principal define, como funciones internas (closures), estos bloques de renderizado:
- `renderWelcome` (~270 líneas)
- `renderHabeasDataModal` (~79 líneas)
- `renderCalibration` (~208 líneas)
- `renderSkeleton` (~28 líneas)
- `renderTest` (~130 líneas)
- `renderParentData` (~124 líneas)
- `renderResults` (~300 líneas)
- `renderDocumentPreview` (~1.049 líneas — el bloque más grande de los tres archivos completos)
- `renderError` (~12 líneas)

Estas funciones **no reciben props**: leen directamente decenas de variables de estado y handlers del scope del componente padre (`diagnosis`, `answers`, `phase`, `highContrast`, `valeriaEnabled`, `showConfetti`, `generatePDF`, `handleAnswer`, etc. — más de 30 identificadores solo en los primeros renders inspeccionados). Convertir cada una en un componente de archivo propio implica:
- Enumerar exhaustivamente cada variable/handler que usa (riesgo de omitir una y romper el build o, peor, un bug silencioso de closure obsoleto).
- Decidir si se pasan como props individuales (muchas props, > 8, viola la regla de oro del punto 6) o como un objeto de contexto/hook compartido — esto último es un cambio de arquitectura, no una extracción mecánica, y se sale del alcance de "cortar y pegar sin cambiar comportamiento".
- `renderDocumentPreview` en particular mezcla JSX con generación de contenido para PDF (`html2pdf`) — el acoplamiento con refs del DOM y el resultado exacto del PDF hace que un error de props sea difícil de detectar visualmente (solo se nota al generar y comparar el PDF final).

**Recomendación**: tratar la extracción de los `render*` de `DiagnosticoVAK` como una Fase 2 separada, con su propio spike de 1-2 render functions primero (empezar por `renderSkeleton`, el más chico y con menos dependencias) para validar cuántas props reales se necesitan antes de comprometerse con las 9 funciones.

### Orden de ejecución sugerido (Fase 1, solo lo seguro)
1. Crear `DiagnosticoVAK/vakIcons.js`.
2. Crear `DiagnosticoVAK/ValeriaControls.jsx`.
3. Actualizar imports en `DiagnosticoVAK.jsx`, borrar código movido.
4. Verificar en navegador: iniciar el diagnóstico VAK completo (welcome → calibración → test → resultados → PDF), confirmar que la barra de Valeria (mute/volumen/expresión) funciona igual, y que los íconos se ven correctos en preguntas y resultados.
5. Commit.
6. (Fuera de Fase 1) Abrir spike separado para `renderSkeleton` como prueba de concepto de extracción de `render*`.

---

## Checklist de verificación por extracción (aplicar siempre)

- [ ] El archivo original compila sin warnings de imports no usados.
- [ ] El archivo nuevo compila y exporta lo esperado.
- [ ] `npm run build` pasa.
- [ ] Se probó el flujo en navegador (no solo que compile) y visualmente es idéntico.
- [ ] El archivo resultante quedó < 500 líneas (si no, seguir extrayendo antes de cerrar el paso).
- [ ] Commit con mensaje claro: `refactor(<área>): extract <Componente> to <ruta>`.

## Resumen ejecutivo

- **Empezar por `DaniTutorChat.jsx`**: 6 sub-componentes `memo` + 1 archivo de utils puros → carpeta `dani/`, ~8 archivos nuevos, riesgo bajo, sirve para validar el patrón de trabajo con Forge.
- **Seguir con `NicoModern.jsx`**: 5 archivos nuevos de funciones/constantes puras de módulo, riesgo medio (el componente principal con `handleSendMessage` de 440 líneas NO se toca en Fase 1).
- **`DiagnosticoVAK.jsx` al final y con alcance reducido**: solo 2 archivos nuevos (`ValeriaControls.jsx`, `vakIcons.js`) en Fase 1; las 9 funciones `render*` (incluida una de ~1.049 líneas) se documentan como Fase 2 porque son closures fuertemente acopladas al estado del componente — extraerlas ahora es el mayor riesgo de romper comportamiento de los tres archivos.
