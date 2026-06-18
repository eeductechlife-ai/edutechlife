# VAK Diagnostic Redesign — Especificación Técnica

> **Versión:** 1.0
> **Autor:** AI Arquitecto
> **Audiencia:** Valeria (Psicóloga), equipo de desarrollo
> **Estándares de referencia:** AERA/APA/NCME Standards for Educational and Psychological Testing (2014), ISO 10667

---

## 1. Resumen Ejecutivo

El Diagnóstico VAK actual tiene 3 problemas críticos: **demora excesiva por voz secuencial** (~2.6 min promedio de TTS forzado), **diseño psicométrico insuficiente** (10 preguntas, conteo simple, sin métricas de confiabilidad), y **arquitectura monolítica** (2,686 líneas en un solo componente). Este rediseño aborda los 3 frentes manteniendo la esencia conversacional de Valeria.

---

## 2. Problemas Identificados

### 2.1 Rendimiento — Voz

| Métrica | Valor actual | Objetivo |
|---------|:-:|:-:|
| Segmentos TTS totales | 43 | ~15 |
| Tiempo total con voz activada | ~155s promedio | ~40s |
| Tiempo total con voz desactivada | ~90s (carga forzada) | ~8s |
| Demoras artificiales (600ms × 4 + 1500ms) | 3.9s | 0s |

### 2.2 Psicometría

| Aspecto | Actual | Estándar AERA/APA/NCME | Brecha |
|---------|--------|------------------------|--------|
| Número de ítems | 10 | 20-40 por constructo | Crítica |
| Puntuación | Conteo simple | Puntuación T con IC 95% | Crítica |
| Confiabilidad (α de Cronbach) | No calculado | ≥ 0.70 mínimo, ≥ 0.80 preferido | Crítica |
| Validez de constructo | No evaluada | AFC + CVI | Crítica |
| Análisis de ítems | No realizado | Dificultad, discriminación, distractores | Crítica |
| Baremación | No existe | Percentiles por grupo etario | Moderada |
| Reporte | Categórico ("Eres Visual") | Perfil continuo con IC | Moderada |

### 2.3 Arquitectura

| Archivo | Líneas | Límite | Exceso |
|---------|:-:|:-:|:-:|
| `DiagnosticoVAK.jsx` | 2,686 | 500 | 5.4× |
| `DiagnosticoVAK.css` | 2,485 | 500 | 5× |
| `useEffect` hooks | 13 | 3-5 | 3-4× |
| Dependencias | html2pdf.js (450KB), Recharts, 20 animaciones | — | Alto impacto |

---

## 3. Diseño de la Solución

### 3.1 Flujo de Usuario (Revisado)

```
[Intro] → [Calibración] → [Test: 24 preguntas] → [Resultados] → [Reporte PDF]
   │           │                  │                     │
   ▼           ▼                  ▼                     ▼
Valeria   Formulario         24 preguntas          Perfil continuo
saluda    visible +           randomizadas         3 scores + IC 95%
explica   Valeria habla       × 3 estilos           α de Cronbach
          en paralelo         (8 por estilo)        recomendaciones
                             sin repetición         multi-estilo
```

### 3.2 Optimización de Voz (Sección 1 — Corregida)

**Reglas:**

1. **Voz desactivada por defecto** en todos los roles excepto la primera vez del usuario. Botón flotante "Activar Valeria" siempre visible.
2. **Valeria termina de leer siempre** antes de habilitar la respuesta del estudiante (corrección solicitada).
3. **Eliminar todas las demoras artificiales**: los 4 × 600ms en calibración se reemplazan por transiciones visuales simultáneas (Valeria habla mientras la UI ya muestra el siguiente campo).
4. **Eliminar demora de 1500ms** antes de resultados. Reemplazar por animación de transición (carga de radar chart + confeti) de 500ms.
5. **Encouragement solo cada 3 preguntas**: Q3, Q6, Q9 (en vez de cada pregunta). Reduce de 10 a 3 segmentos.
6. **Progress update eliminado** del flujo de preguntas. Se muestra como barra de progreso visual siempre visible.
7. **Calibración compacta**: Valeria da la bienvenida general (1 segmento), luego el formulario está visible. Valeria NO lee cada campo secuencialmente. Solo confirma al final "¡Gracias, [nombre]!" (1 segmento).

**Cálculo de tiempo con voz activada:**

| Fase | Segmentos | Tiempo estimado |
|------|:-:|:-:|
| Bienvenida + explicación | 2 | ~6s |
| Calibración | 2 (bienvenida + confirmación final) | ~6s |
| Transición al test | 1 | ~3s |
| 24 preguntas: lectura | 24 (2-3s c/u) | ~60s |
| Encouragement (Q3,Q6,Q9) | 3 | ~9s |
| Resultados + despedida | 2 | ~6s |
| **Total** | **~34** | **~90s** |

*Reducción: 155s → 90s (42% menos). Y con voz desactivada: 155s → 8s (95% menos).*

### 3.3 Rediseño Psicométrico

#### 3.3.1 Banco de Preguntas (48 preguntas)

```
Edad 6-9:   16 preguntas (8 por estilo × 2 rounds de respaldo)
Edad 10-13: 16 preguntas (8 por estilo × 2 rounds de respaldo)
Edad 14-17: 16 preguntas (8 por estilo × 2 rounds de respaldo)
```

Cada pregunta incluye metadatos:
```javascript
{
  id: 'vak_6_001',
  text: '¿Cómo prefieres aprender algo nuevo?',
  ageGroup: '6-9',
  style: 'visual',        // estilo que mide
  difficulty: 0.65,       // índice de dificultad (0-1)
  discrimination: 0.48,   // índice de discriminación (punto biserial)
  options: [
    { text: '...', type: 'visual', isKey: true },
    { text: '...', type: 'auditivo', isKey: false },
    { text: '...', type: 'kinestesico', isKey: false },
  ]
}
```

**Administración:** Se presentan 24 preguntas por sesión (8 por estilo), seleccionadas aleatoriamente de las 16 disponibles por grupo etario. Sin repetición dentro de la misma sesión.

#### 3.3.2 Scoring (Puntuación T con IC 95%)

```javascript
function calculateVAKScore(counts, totalQuestions) {
  // counts = { visual: 8, auditivo: 5, kinestesico: 7 }
  // totalQuestions = 24 (8 por estilo)

  const rawPercentages = {
    visual: counts.visual / totalQuestions * 100,
    auditivo: counts.auditivo / totalQuestions * 100,
    kinestesico: counts.kinestesico / totalQuestions * 100,
  };

  // Puntuación T: M=50, SD=10
  // transformación logit para normalizar proporciones
  const T = {};

  for (const [style, pct] of Object.entries(rawPercentages)) {
    const proportion = pct / 100;
    const logit = Math.log(proportion / (1 - proportion + 0.001));
    T[style] = 50 + 10 * logit;
  }

  // IC 95% usando error estándar (asumiendo α = 0.80 como objetivo)
  const SE = 10 * Math.sqrt(1 - 0.80); // = 4.47
  const CI = 1.96 * SE; // ≈ 8.77 puntos

  const intervals = {};
  for (const [style, tScore] of Object.entries(T)) {
    intervals[style] = {
      score: Math.round(tScore),
      ci95: {
        lower: Math.round(tScore - CI),
        upper: Math.round(tScore + CI),
      },
      percentile: Math.round(normalCDF(tScore, 50, 10) * 100),
    };
  }

  // Clasificación: solo si hay diferencia significativa (IC no se solapan)
  const predominantStyle = determinePredominant(intervals);

  return { rawPercentages, T, intervals, predominantStyle };
}
```

#### 3.3.3 Cálculo de α de Cronbach (en cliente)

```javascript
function calculateCronbachAlpha(responsesByItem) {
  // responsesByItem: array de { visual: 1|0, auditivo: 1|0, kinestesico: 1|0 }
  // para cada ítem, 1 = respuesta correcta para ese estilo

  const k = responsesByItem.length;
  if (k < 2) return null;

  // Varianza de cada ítem
  const itemVariances = [];
  for (let i = 0; i < k; i++) {
    const scores = Object.values(responsesByItem[i]);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
    itemVariances.push(variance);
  }

  // Varianza del puntaje total por estilo
  const totalScores = { visual: [], auditivo: [], kinestesico: [] };
  for (const item of responsesByItem) {
    totalScores.visual.push(item.visual);
    totalScores.auditivo.push(item.auditivo);
    totalScores.kinestesico.push(item.kinestesico);
  }

  const totalVariance = {};
  for (const [style, scores] of Object.entries(totalScores)) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    totalVariance[style] = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
  }

  // α = (k / (k-1)) * (1 - Σσ²_i / σ²_total)
  const alpha = {};
  for (const style of ['visual', 'auditivo', 'kinestesico']) {
    const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
    alpha[style] = (k / (k - 1)) * (1 - sumItemVar / totalVariance[style]);
  }

  return alpha;
}
```

Interpretación: α ≥ 0.90 → Excelente, α ≥ 0.80 → Bueno, α ≥ 0.70 → Aceptable, α < 0.70 → Pobre.

#### 3.3.4 Reporte de Resultados

```
Resultados del Diagnóstico VAK
─────────────────────────────────
Fecha: 18/06/2026
Estudiante: Sofía (12 años)

Puntajes (Escala T, M=50, SD=10):

  Visual:      58 (IC 95%: 49-67) — Percentil 79
  Auditivo:    45 (IC 95%: 36-54) — Percentil 31
  Kinestésico: 52 (IC 95%: 43-61) — Percentil 58

Confiabilidad del test:
  α de Cronbach = 0.82 (Buena)

Interpretación:
  No hay un estilo dominante con diferencia estadística significativa
  (los intervalos de confianza se solapan).
  Perfil: Aprendiz multimodal con倾向视觉-kinestésica.

Recomendaciones:
  • Estrategias visuales: mapas mentales, videos, diagramas
  • Estrategias kinestésicas: experimentos, proyectos prácticos
  • Complementar con actividades auditivas: discusiones, podcasts
```

### 3.4 Arquitectura de Componentes

```
src/components/DiagnosticoVAK/
├── index.js                    # Barrel export
├── VAKLayout.jsx               # Orquestador de fases (antes ~2686 líneas → ~200)
├── VAKWelcome.jsx              # Pantalla de bienvenida + explicación
├── VAKCalibration.jsx          # Formulario de datos + Valeria paralela
├── VAKTest.jsx                 # Contenedor del test (barra progreso, timer)
├── VAKQuestionCard.jsx         # Tarjeta de pregunta individual
├── VAKResultReport.jsx         # Radar chart + perfil + IC + α + recomendaciones
├── VAKPDFPreview.jsx           # Vista previa del PDF
├── VAKPDFGenerator.js          # Generación de PDF con jsPDF (sin html2pdf.js)

src/hooks/
├── useValentinaAgent.js        # Simplificado (eliminar calibración secuencial)
├── useVAKScoring.js            # Scoring con puntuación T + IC 95%
├── useVAKReliability.js        # Cálculo de α de Cronbach en cliente

src/utils/
├── vakReportGenerator.js       # Generación de contenido del reporte

src/data/
├── vakQuestions.js             # Banco unificado de 48 preguntas con metadatos
  (deprecar: vakData.es.js, vakData.en.js)
```

**Eliminar:**
- `src/constants/vakData.js` (redundante con `vakQuestions.js`)
- `src/constants/vakData.es.js` (duplicado, grupos inconsistentes)
- `src/constants/vakData.en.js` (duplicado, grupos inconsistentes)

### 3.5 Generación de PDF (Sin html2pdf.js)

**Problema actual:** html2pdf.js (html2canvas + jsPDF) captura DOM → canvas → PDF. Tarda 2-5s, bloquea el hilo principal, peso ~450KB.

**Solución propuesta:** jsPDF directo con renderizado programático.

```javascript
import { jsPDF } from 'jspdf';

export function generateVAKPDF(result, studentData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 20;
  let y = margin;

  // Encabezado corporativo
  doc.setFillColor(0, 75, 99); // #004B63
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Diagnóstico VAK', pageWidth / 2, 25, { align: 'center' });

  // Contenido
  y = 55;
  doc.setTextColor(0, 75, 99);
  doc.setFontSize(14);
  doc.text(`Estudiante: ${studentData.name}`, margin, y);
  y += 8;
  doc.text(`Edad: ${studentData.age} años`, margin, y);
  y += 8;
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, y);

  // Puntajes con barras
  y += 15;
  doc.setFontSize(12);
  for (const style of ['visual', 'auditivo', 'kinestesico']) {
    const score = result.intervals[style];
    const barWidth = (score.score / 100) * (pageWidth - 2 * margin);

    doc.setTextColor(50, 50, 50);
    doc.text(style.charAt(0).toUpperCase() + style.slice(1), margin, y + 4);
    doc.setFillColor(77, 168, 196); // #4DA8C4
    doc.rect(margin + 60, y, barWidth, 8, 'F');
    doc.text(`${score.score} (IC: ${score.ci95.lower}-${score.ci95.upper})`,
      margin + 60 + barWidth + 5, y + 4);

    y += 14;
  }

  // α de Cronbach
  y += 10;
  doc.setTextColor(0, 75, 99);
  doc.text(`Confiabilidad: α = ${result.cronbachAlpha.toFixed(2)}`, margin, y);

  // Recomendaciones
  y += 15;
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  for (const rec of result.recommendations) {
    doc.text(`• ${rec}`, margin, y);
    y += 6;
  }

  doc.save('diagnostico-vak.pdf');
  return doc;
}
```

**Tiempo estimado:** < 200ms (vs 2-5s actual). **Peso:** ~50KB (vs 450KB).

### 3.6 Diseño Visual (Frontend Design)

- Colores corporativos: `#004B63` (azul petróleo) para títulos y bordes de énfasis; `#4DA8C4` / `#00BCD4` (cyan) para elementos interactivos
- Tarjetas con `border-t-4 border-[#004B63]` para consistencia con el resto de la plataforma
- Glassmorphism en las tarjetas de opciones (`backdrop-filter: blur(8px)`) — mantener pero limitar a 1-2 animaciones simultáneas, no 20
- Barra de progreso siempre visible durante el test (reemplaza progress update por voz)
- Layout responsive con `items-start` para evitar espacios muertos
- Grid de 2 columnas en resultados (radar chart + puntajes numéricos)

---

## 4. Plan de Migración

### Fase 1: Base (Día 1-2)
1. Crear nuevo banco de preguntas unificado (48 preguntas con metadatos)
2. Deprecar `vakData.es.js` / `vakData.en.js`
3. Crear hooks `useVAKScoring.js` y `useVAKReliability.js`
4. Verificar que los cálculos psicométricos sean correctos

### Fase 2: Split de Componentes (Día 3-5)
5. Crear `VAKLayout.jsx` como orquestador
6. Extraer `VAKWelcome.jsx`
7. Extraer `VAKCalibration.jsx` (con voz paralela)
8. Extraer `VAKTest.jsx` + `VAKQuestionCard.jsx`
9. Extraer `VAKResultReport.jsx` (con radar, IC, α)
10. Extraer `VAKPDFPreview.jsx`

### Fase 3: Optimización (Día 6-7)
11. Reemplazar html2pdf.js por generación directa con jsPDF
12. Eliminar demoras artificiales (600ms × 4, 1500ms)
13. Reducir animations (max 2 simultaneous, prefer `reduced-motion`)
14. Desactivar voz por defecto con botón de activación persistente
15. Simplificar `useValentinaAgent.js`

### Fase 4: QA y Polishing (Día 8)
16. Verificar cálculo de α de Cronbach con datos simulados
17. Probar flujo completo con voz activada/desactivada
18. Probar PDF generation en móvil y desktop
19. Verificar i18n (ES/EN) para todas las nuevas UI
20. `npx vite build` exit 0

---

## 5. Métricas de Éxito

| Métrica | Actual | Objetivo | Cómo se mide |
|---------|:-:|:-:|-------------|
| Líneas de `DiagnosticoVAK.jsx` | 2,686 | ~200 (orquestador) | `wc -l` |
| Tiempo de carga inicial | ~5s | ~1.5s | Lighthouse |
| TTS total con voz activada | ~155s | ~90s | Medición manual |
| TTS total con voz desactivada | ~90s | ~8s | Medición manual |
| α de Cronbach | N/A | ≥ 0.80 | Cálculo en reporte |
| Tamaño de PDF bundle | ~450KB | ~50KB | `npx vite build --report` |
| Tiempo de generación PDF | 2-5s | < 500ms | `console.time` |

---

## 6. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|:--:|:--:|-----------|
| α de Cronbach bajo (< 0.70) | Media | Alto | Aumentar ítems por estilo a 10 (30 total). Revisar redacción de preguntas |
| Romper ruta `/vak` existente | Baja | Alto | Mantener `index.js` barrel export con mismo nombre de exportación |
| Usuarios esperan voz activada por defecto | Media | Bajo | Mostrar tooltip "Activa a Valeria para una experiencia guiada" en primera visita |
| jsPDF no replica diseño exacto del HTML | Baja | Medio | Diseñar PDF como template programático, no como captura de DOM |
| Inconsistencia con kids-dashboard VAK | Baja | Medio | `VAKDiagnosticEnhanced.jsx` mantiene su propio flujo (no se modifica) |

---

## 7. Archivos Afectados

### Modificar:
- `src/components/DiagnosticoVAK/DiagnosticoVAK.jsx` → Dividir
- `src/components/DiagnosticoVAK/DiagnosticoVAK.css` → Dividir
- `src/hooks/useValentinaAgent.js` → Simplificar
- `src/data/vakQuestions.js` → Expandir a 48 preguntas
- `src/components/pages/VAKDiagnosisPage.jsx` → Verificar import
- `src/components/DiagnosticoVAK/index.js` → Actualizar barrel

### Crear:
- `src/components/DiagnosticoVAK/VAKLayout.jsx`
- `src/components/DiagnosticoVAK/VAKWelcome.jsx`
- `src/components/DiagnosticoVAK/VAKCalibration.jsx`
- `src/components/DiagnosticoVAK/VAKTest.jsx`
- `src/components/DiagnosticoVAK/VAKQuestionCard.jsx`
- `src/components/DiagnosticoVAK/VAKResultReport.jsx`
- `src/components/DiagnosticoVAK/VAKPDFPreview.jsx`
- `src/components/DiagnosticoVAK/VAKPDFGenerator.js`
- `src/hooks/useVAKScoring.js`
- `src/hooks/useVAKReliability.js`
- `src/utils/vakReportGenerator.js`

### Eliminar:
- `src/constants/vakData.js`
- `src/constants/vakData.es.js`
- `src/constants/vakData.en.js`

---

## 8. Referencias

- AERA, APA, NCME. (2014). *Standards for Educational and Psychological Testing*. Washington, DC: AERA.
- ISO 10667-1:2020. *Assessment service delivery — Procedures and methods to assess people in work and organizational settings*.
- Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. *Psychometrika, 16*(3), 297-334.
- Fleiss, J. L. (1981). *Statistical Methods for Rates and Proportions*. New York: John Wiley.
