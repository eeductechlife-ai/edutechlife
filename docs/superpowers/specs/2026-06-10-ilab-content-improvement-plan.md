# iLAB Content Improvement Plan — Voice & Tone + Lexical Audit

## 1. Diagnóstico Actual

### Problemas Identificados

| # | Problema | Ejemplo | Impacto |
|---|----------|---------|---------|
| P1 | **Inconsistencia terminológica** | "Desafío" vs "Challenge" vs "Reto" se usan indistintamente | Confunde al estudiante |
| P2 | **Textos densos sin jerarquía** | Párrafos de 4+ líneas en OVAs sin bullet points ni separación | Abruma, difícil de escanear |
| P3 | **Definiciones técnicas sin anclaje** | "Fine-tuning", "RAG", "temperature", "embeddings" aparecen sin contexto introductorio | El estudiante nuevo se pierde |
| P4 | **Tono mixto** | Mezcla de "Usted" formal con "tú" informal según el archivo | Sensación de inconsistencia |
| P5 | **Longitud de títulos variable** | Módulo 1: "Ingeniería de Prompts" (técnico) vs Módulo 4: "Inmersión NotebookLM" (marketing) | Sin patrón unificado |
| P6 | **Texto UI vs texto educativo mezclado** | Botones con texto muy largo y explicaciones muy cortas | Experiencia desigual |
| P7 | **Anglicismos sin traducción** | "Prompt", "Fine-tuning", "Grounding", "Benchmark" sin explicación en español | Barrera de entrada |
| P8 | **Flashcards sin contexto** | "¿Qué es un LLM?" → "Modelo de lenguaje entrenado..." — definición correcta pero falta un "para qué sirve" | Aprendizaje superficial |

---

## 2. Voice & Tone — Voz y Tono de iLAB

### Personalidad de Marca
**iLAB Academic** habla como un mentor experto que:
- Sabe de lo que habla (autoridad académica)
- Explica con claridad (didáctico)
- Motiva sin ser condescendiente (inspirador)
- Usa "tú" en todo el ecosistema (cercano pero profesional)

### Principios de Redacción

| Principio | Qué significa | Cómo se aplica |
|-----------|--------------|----------------|
| **Claridad > Impresionar** | Preferir "aprende a dar instrucciones a la IA" sobre "domina la orquestación de prompts sistémicos" | Vocabulario accesible sin perder precisión |
| **Primero el porqué, luego el qué** | Antes de definir un concepto, explicar para qué sirve en la vida real | Estructura: problema → solución → concepto |
| **Español natural** | Los términos técnicos en inglés se traducen o se explican la primera vez que aparecen | "Prompt (instrucción que le das a la IA)" |
| **Activo, no pasivo** | "La IA analiza los datos" en vez de "Los datos son analizados por la IA" | Verbos de acción directa |
| **Jerarquía visual del texto** | Párrafos cortos (2-3 líneas máx), bullet points, negritas para keywords | Escaneable en 3 segundos |

### Glosario Unificado

| Término actual | Término unificado | Explicación para nuevo estudiante |
|---------------|-------------------|----------------------------------|
| Prompt | Prompt (instrucción) | "Prompt: la instrucción o pregunta que le escribes a la IA" |
| Fine-tuning | Fine-tuning (ajuste fino) | "Fine-tuning: entrenar un modelo con tus propios datos" |
| RAG | RAG (búsqueda inteligente) | "RAG: cuando la IA busca en documentos para responder" |
| Grounding | Grounding (verificación de fuentes) | "Grounding: mecanismo que conecta la IA con fuentes reales" |
| Challenge / Desafío / Reto | Desafío (consistente) | Unificar a "Desafío" en todo el curso |
| Evaluación | Evaluación | Sin cambio |
| OVA | Laboratorio | "Laboratorio interactivo" en lugar de "OVA" (término muy técnico) |

---

## 3. Plan de Trabajo por Prioridad

### Prioridad 1 — Alto impacto, bajo esfuerzo (cambios en i18n)

| # | Archivo | Cambio | Esfuerzo |
|---|---------|--------|----------|
| 1.1 | `es.json` — `nav.ialab_pro` | Ya cambiado ✅ | — |
| 1.2 | `es.json` — todos los `ialab.*` | Unificar "Desafío"/"Reto" → "Desafío". Revisar tono "tú" consistente | 2h |
| 1.3 | `es.json` — `flashcard.*` | Simplificar instrucciones. Cambiar "Anterior"/"Siguiente" por más intuitivos | 1h |
| 1.4 | `es.json` — `valerio.*` | Asegurar que Valerio usa "tú" consistentemente y explica términos técnicos | 1h |
| 1.5 | `es.json` — `badge.*` | Nombres de insignias más descriptivos: "Primeros Pasos" → "Primer Prompt" | 30min |

### Prioridad 2 — Contenido educativo visible (módulos, flashcards, landing)

| # | Archivo | Cambio | Esfuerzo |
|---|---------|--------|----------|
| 2.1 | `data/ialab.js` — Descripciones de módulos | Reescribir para que sigan estructura: "Problema → Solución → Qué aprenderás" | 3h |
| 2.2 | `data/ialab.js` — Títulos de lecciones | Unificar longitud (5-8 palabras), tono activo, sin marketing | 2h |
| 2.3 | `data/ialab.js` — Learning objectives | Reescribir en formato "Vas a poder: [acción concreta]" | 2h |
| 2.4 | `FlashcardArena.jsx` — 35 flashcards | Simplificar definiciones: agregar "para qué sirve" al inicio de cada respuesta | 3h |
| 2.5 | `landingPageData.js` — Textos de landing | Unificar con voz de iLAB. Cambiar "Domina" por "Aprende a usar" | 1h |
| 2.6 | `IALabSignUpPage.jsx` — Texto de registro | Simplificar beneficios. Que quede claro QUÉ obtiene el estudiante | 1h |

### Prioridad 3 — OVAs y laboratorios (contenido más profundo)

| # | Archivo | Cambio | Esfuerzo |
|---|---------|--------|----------|
| 3.1 | `ova/notebookLab.es.js` | Simplificar enunciados de preguntas. Agregar contexto antes de cada pregunta | 2h |
| 3.2 | `ova/practicalCases.es.js` | Agregar "escenario real" al inicio de cada caso para contextualizar | 1.5h |
| 3.3 | `ova/ethicalDilemmas.es.js` | Simplificar dilemas: escenario de 3 líneas máx, luego preguntas | 1.5h |
| 3.4 | `QueEsPrompt_OVA_Original.jsx` | Texto muy denso — dividir en párrafos más cortos, agregar ejemplos visuales | 3h |
| 3.5 | `OVAIntroPrompt.jsx` | Títulos de pantalla más descriptivos | 1h |
| 3.6 | `OVABuildGPT/index.jsx` | Textos de Valerio más conversacionales, menos técnicos | 1h |

### Prioridad 4 — Evaluaciones y challenges

| # | Archivo | Cambio | Esfuerzo |
|---|---------|--------|----------|
| 4.1 | `IALabEvaluationStep1.jsx` | Valores por defecto más genéricos y explicativos | 1h |
| 4.2 | `IALabEvaluationStep2.jsx` | Placeholders más claros para el estudiante | 1h |
| 4.3 | `IALabEvaluationStep3.jsx` | Opciones más representativas de casos reales | 1h |
| 4.4 | `es.json` — `ialab.evaluation.*` | Simplificar instrucciones de evaluación | 2h |

### Prioridad 5 — Valerio y prompts del chatbot

| # | Archivo | Cambio | Esfuerzo |
|---|---------|--------|----------|
| 5.1 | `valerioPrompts.js` — Fallback responses | Respuestas más naturales, menos robóticas. Incluir emojis con criterio | 2h |
| 5.2 | `prompts.es.js` — Prompt del sistema | Agregar instrucción explícita de que Valerio explique términos técnicos automáticamente | 1h |
| 5.3 | `prompts.es.js` — PROMPT_PSICOLOGO_VAK | Mejorar claridad del prompt para que Dani hable más natural | 1h |

---

## 4. Ejemplos Antes / Después

### Ejemplo 1: Descripción de Módulo (ialab.js)

**Antes:**
> "Aprende a comunicarte efectivamente con la IA mediante la ingeniería de prompts. Domina el método RTF (Role, Task, Format) y crea prompts profesionales."

**Después:**
> "Los prompts son el idioma de la IA. Aquí aprenderás a darle instrucciones claras para que haga exactamente lo que necesitas. Dominarás el método RTF (Rol, Tarea, Formato) para escribir prompts profesionales desde el primer día."

### Ejemplo 2: Flashcard (FlashcardArena.jsx)

**Antes:**
> Front: "¿Qué es un LLM?"
> Back: "Modelo de lenguaje entrenado con enormes cantidades de texto para comprender y generar lenguaje humano."

**Después:**
> Front: "¿Qué es un LLM?"
> Back: "Un LLM (Large Language Model) es una IA que entiende y escribe como humano. Se usa en chatbots, traducción y generación de contenido. Se entrena con millones de textos para aprender patrones del lenguaje."

### Ejemplo 3: Título de Lección (ialab.js)

**Antes:**
> "Gemini: La IA que Ve, Lee y Escucha"

**Después:**
> "Gemini: Cómo usar IA que procesa imágenes, audio y texto"

### Ejemplo 4: Objetivo de Aprendizaje (ialab.js)

**Antes:**
> "Comprender los fundamentos de la ingeniería de prompts"

**Después:**
> "Vas a poder escribir prompts claros y estructurados que la IA entienda a la primera."

---

## 5. Criterios de Calidad por Tipo de Texto

| Tipo | Extensión | Tono | Estructura |
|------|-----------|------|------------|
| Título de módulo | 3-6 palabras | Descriptivo, sin marketing | [Concepto principal] |
| Título de lección | 5-8 palabras | Acción + beneficio | Verbo en infinitivo + concepto |
| Descripción de módulo | 2-3 oraciones | Explicativo, motivador | Problema → Solución → Qué lograrás |
| Learning objective | 1 oración | Medible, concreto | "Vas a poder [verbo] + [objeto] + [contexto]" |
| Flashcard front | 1 pregunta | Simple, directa | ¿Qué es / Cómo funciona / Para qué sirve? |
| Flashcard back | 2-3 oraciones | Explicativo | Definición + uso real + ejemplo breve |
| Instrucción UI | 2-5 palabras | Imperativo, claro | "Cerrar", "Siguiente", "Comenzar diagnóstico" |
| Mensaje de Valerio | 2-4 oraciones | Conversacional, cálido | Saludo + respuesta + siguiente paso |

---

## 6. Implementación

### Orden sugerido
1. **Semana 1**: Prioridad 1 (i18n) — cambios en archivos de traducción, impacto inmediato
2. **Semana 2**: Prioridad 2 (módulos, flashcards, landing) — lo más visible para el estudiante
3. **Semana 3**: Prioridad 3 (OVAs, laboratorios) — contenido educativo profundo
4. **Semana 4**: Prioridad 4 y 5 (evaluaciones, Valerio) — pulido final

### Riesgos
- **No romper funcionalidad**: Los cambios son SOLO de texto en archivos de datos/i18n. Cero riesgo de breakage.
- **Coherencia**: Asegurar que el glosario unificado se aplique en todos los archivos (revisión cruzada).
- **Regresión**: Los tests existentes no cubren strings de texto, pero se debe verificar visualmente después de cambios.

### Métricas de éxito
- Estudiantes reportan que "los textos se entienden mejor" (feedback cualitativo)
- Reducción de preguntas en foro sobre "qué significa X término"
- Mayor tasa de finalización de módulos (menos abandono por frustración con el lenguaje)
