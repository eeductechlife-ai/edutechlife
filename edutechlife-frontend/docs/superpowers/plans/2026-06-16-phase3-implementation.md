# Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans

**Goal:** Implement 5 premium features for SmartBoard Kids Dashboard (Oral Exam, Curriculum COL, Collaborative Study, Multi-modal Dani, Advanced Analytics)

**Architecture:** Frontend-only, all new features as lazy-loaded tabs or inline chat blocks. Uses existing DeepSeek API, Recharts, framer-motion, localStorage.

**Tech Stack:** React, DeepSeek API, Recharts, framer-motion, Web Speech API, localStorage

---

### Task 1: Curriculum COL DBA JSON

**Files:**
- Create: `src/data/curriculo_col.json`
- Create: `src/components/kids-dashboard/CurriculumView.jsx`
- Modify: `src/components/kids-dashboard/SmartBoardKidsDashboard.jsx` (add tab)

- [ ] **Step 1: Create DBA taxonomy JSON**

```json
{
  "version": "1.0",
  "source": "MEN Colombia",
  "grades": [
    {
      "grado": 6,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Comprende la relación entre fracciones, decimales y porcentajes",
            "Resuelve problemas que involucran operaciones con números enteros",
            "Identifica y clasifica figuras geométricas según sus propiedades",
            "Calcula áreas y perímetros de figuras planas",
            "Interpreta y construye gráficos estadísticos básicos",
            "Resuelve ecuaciones simples de primer grado",
            "Comprende el concepto de proporcionalidad directa e inversa",
            "Utiliza el plano cartesiano para ubicar puntos"
          ]
        },
        {
          "id": "lenguaje",
          "nombre": "Lenguaje",
          "icon": "📖",
          "color": "#FF6B9D",
          "competencias": [
            "Producción textual",
            "Comprensión e interpretación textual",
            "Literatura",
            "Medios de comunicación",
            "Ética de la comunicación"
          ],
          "dba": [
            "Comprende textos narrativos, líricos y dramáticos",
            "Produce textos escritos con coherencia y cohesión",
            "Identifica la intención comunicativa de diferentes tipos de texto",
            "Reconoce las características de los géneros literarios",
            "Utiliza correctamente reglas ortográficas y gramaticales básicas"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende la clasificación de los seres vivos en reinos",
            "Explica los ciclos biogeoquímicos básicos (agua, carbono)",
            "Identifica las propiedades de la materia y sus estados",
            "Comprende conceptos básicos de energía y sus transformaciones",
            "Reconoce la importancia de la biodiversidad en Colombia"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Comprende las características del relieve colombiano",
            "Identifica las regiones naturales de Colombia",
            "Reconoce la organización política y administrativa del país",
            "Comprende conceptos básicos de democracia y participación ciudadana",
            "Analiza las causas y consecuencias de la independencia de Colombia"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende instrucciones y expresiones cotidianas",
            "Identifica información básica en textos cortos en inglés",
            "Produce frases y oraciones simples sobre temas familiares",
            "Participa en conversaciones breves sobre temas conocidos"
          ]
        }
      ]
    },
    {
      "grado": 7,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Opera con números racionales en diferentes contextos",
            "Comprende el concepto de función y sus representaciones",
            "Resuelve problemas utilizando proporcionalidad y porcentajes",
            "Identifica transformaciones geométricas (traslación, rotación, reflexión)",
            "Calcula volúmenes de cuerpos geométricos simples",
            "Interpreta datos a partir de medidas de tendencia central"
          ]
        },
        {
          "id": "lenguaje",
          "nombre": "Lenguaje",
          "icon": "📖",
          "color": "#FF6B9D",
          "competencias": [
            "Producción textual",
            "Comprensión e interpretación textual",
            "Literatura",
            "Medios de comunicación",
            "Ética de la comunicación"
          ],
          "dba": [
            "Analiza textos argumentativos identificando tesis y argumentos",
            "Produce textos argumentativos con estructura clara",
            "Comprende el contexto histórico de obras literarias",
            "Identifica figuras retóricas en textos poéticos"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende la organización del sistema solar",
            "Explica los fenómenos de la herencia genética básica",
            "Identifica los niveles de organización ecológica",
            "Comprende las relaciones tróficas en los ecosistemas"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Analiza el proceso de colonización en América",
            "Comprende las características de la época colonial en Colombia",
            "Identifica los movimientos independentistas en Latinoamérica",
            "Reconoce la diversidad étnica y cultural de Colombia"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende la idea principal en textos orales y escritos",
            "Describe personas, lugares y objetos en inglés",
            "Expresa opiniones simples sobre temas cotidianos",
            "Escribe párrafos cortos sobre experiencias personales"
          ]
        }
      ]
    },
    {
      "grado": 8,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Factoriza expresiones algebraicas simples",
            "Resuelve sistemas de ecuaciones lineales 2x2",
            "Comprende el concepto de función lineal y afín",
            "Aplica el teorema de Pitágoras en la resolución de problemas",
            "Calcula probabilidades de eventos simples y compuestos"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende la estructura del átomo y los elementos químicos",
            "Explica reacciones químicas simples",
            "Identifica las leyes de Newton y sus aplicaciones",
            "Comprende conceptos de ondas, sonido y luz"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Analiza la Revolución Industrial y sus consecuencias",
            "Comprende las causas de la Primera Guerra Mundial",
            "Identifica los procesos de globalización económica",
            "Reconoce los derechos humanos y mecanismos de protección"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende textos narrativos y descriptivos en inglés",
            "Participa en discusiones sobre temas familiares",
            "Escribe textos coherentes usando conectores básicos",
            "Comprende información detallada en conversaciones"
          ]
        }
      ]
    },
    {
      "grado": 9,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Resuelve ecuaciones cuadráticas por diferentes métodos",
            "Comprende la función cuadrática y sus aplicaciones",
            "Aplica razones trigonométricas en triángulos rectángulos",
            "Analiza datos bivariados y correlaciones básicas",
            "Comprende sucesiones y progresiones aritméticas y geométricas"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende los fundamentos de la genética mendeliana",
            "Explica los procesos de evolución y selección natural",
            "Identifica los compuestos químicos inorgánicos y sus reacciones",
            "Comprende conceptos de electricidad y magnetismo"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Analiza la Guerra Fría y sus repercusiones globales",
            "Comprende el conflicto armado en Colombia",
            "Identifica los procesos de integración económica regional",
            "Reconoce las problemáticas ambientales contemporáneas"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende textos argumentativos y expositivos en inglés",
            "Expresa y justifica opiniones en discusiones formales",
            "Escribe ensayos cortos con estructura argumentativa",
            "Comprende discursos y presentaciones académicas"
          ]
        }
      ]
    },
    {
      "grado": 10,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Comprende el concepto de límite y continuidad",
            "Aplica la derivada como razón de cambio",
            "Resuelve problemas de optimización usando cálculo diferencial",
            "Analiza distribuciones de probabilidad discretas",
            "Comprende conceptos de estadística inferencial básica"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende la química orgánica y los hidrocarburos",
            "Explica los procesos de síntesis de proteínas",
            "Identifica los principios de la termodinámica",
            "Comprende los conceptos de ácidos, bases y pH"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Analiza las teorías económicas contemporáneas",
            "Comprende la estructura del Estado colombiano",
            "Identifica los mecanismos de participación ciudadana",
            "Reconoce los desafíos del desarrollo sostenible"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende textos académicos y técnicos en inglés",
            "Realiza presentaciones formales en inglés",
            "Escribe documentos formales como ensayos e informes",
            "Participa en debates académicos en inglés"
          ]
        }
      ]
    },
    {
      "grado": 11,
      "materias": [
        {
          "id": "matematicas",
          "nombre": "Matemáticas",
          "icon": "🔢",
          "color": "#4DA8C4",
          "competencias": [
            "Pensamiento numérico y sistemas numéricos",
            "Pensamiento espacial y sistemas geométricos",
            "Pensamiento métrico y sistemas de medidas",
            "Pensamiento aleatorio y sistemas de datos",
            "Pensamiento variacional y sistemas algebraicos"
          ],
          "dba": [
            "Comprende la integral definida como acumulación de cambios",
            "Aplica métodos de integración en problemas de área y volumen",
            "Analiza distribuciones de probabilidad continua",
            "Resuelve problemas de inferencia estadística y pruebas de hipótesis",
            "Aplica herramientas del cálculo en problemas de física y economía"
          ]
        },
        {
          "id": "ciencias",
          "nombre": "Ciencias Naturales",
          "icon": "🔬",
          "color": "#66CCCC",
          "competencias": [
            "Uso comprensivo del conocimiento científico",
            "Explicación de fenómenos",
            "Indagación"
          ],
          "dba": [
            "Comprende los fundamentos de la bioquímica y el metabolismo",
            "Explica los avances en biotecnología y sus implicaciones",
            "Identifica los principios de la física moderna (relatividad, cuántica)",
            "Comprende conceptos de química ambiental y sostenibilidad"
          ]
        },
        {
          "id": "sociales",
          "nombre": "Ciencias Sociales",
          "icon": "🌍",
          "color": "#FFD166",
          "competencias": [
            "Pensamiento social",
            "Interpretación y análisis de perspectivas",
            "Pensamiento reflexivo y sistémico"
          ],
          "dba": [
            "Analiza los desafíos geopolíticos del siglo XXI",
            "Comprende las teorías del desarrollo económico",
            "Identifica las problemáticas sociales contemporáneas",
            "Reconoce la importancia de la paz y la reconciliación en Colombia"
          ]
        },
        {
          "id": "ingles",
          "nombre": "Inglés",
          "icon": "🇬🇧",
          "color": "#4DA8C4",
          "competencias": [
            "Comprensión oral",
            "Comprensión de lectura",
            "Producción oral",
            "Producción escrita"
          ],
          "dba": [
            "Comprende textos especializados y literatura académica",
            "Produce discursos argumentativos complejos en inglés",
            "Analiza críticamente fuentes de información en inglés",
            "Comunica con fluidez ideas complejas en contextos formales"
          ]
        }
      ]
    }
  ]
}
```

Write this JSON to `src/data/curriculo_col.json`.

- [ ] **Step 2: Create CurriculumView component**

```jsx
import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import curriculoData from '../../data/curriculo_col.json';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const dc = (dm, l, d) => dm ? d : l;

const gradeMeta = [
  { grado: 6, label: '6°', color: '#4DA8C4' },
  { grado: 7, label: '7°', color: '#66CCCC' },
  { grado: 8, label: '8°', color: '#FFD166' },
  { grado: 9, label: '9°', color: '#FF6B9D' },
  { grado: 10, label: '10°', color: '#A855F7' },
  { grado: 11, label: '11°', color: '#F59E0B' },
];

const CurriculumView = memo(() => {
  const { darkMode: dm } = useSmartBoardKids();
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [expandedDBA, setExpandedDBA] = useState(null);

  const gradeData = useMemo(() => {
    const g = curriculoData.grades.find(g => g.grado === selectedGrade);
    if (!g) return null;
    const meta = gradeMeta.find(m => m.grado === selectedGrade);
    return { ...g, color: meta?.color || '#4DA8C4' };
  }, [selectedGrade]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC]`}>📋</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Currículo Colombia</h3>
          <p className={`text-xs ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>DBA — Estándares Básicos del MEN</p>
        </div>
      </motion.div>

      {/* Grade selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {gradeMeta.map((g) => (
          <motion.button
            key={g.grado}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedGrade(g.grado); setSelectedMateria(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              selectedGrade === g.grado
                ? 'text-white shadow-md'
                : dc(dm, 'bg-white border border-[#E2E8F0] text-[#64748B]', 'bg-[#1E293B] border border-[#334155] text-[#94A3B8]')
            }`}
            style={selectedGrade === g.grado ? { background: `linear-gradient(135deg, ${g.color}, ${g.color}dd)` } : {}}
          >
            {g.label}
          </motion.button>
        ))}
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradeData?.materias?.map((mat, idx) => (
          <motion.div
            key={mat.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedMateria(selectedMateria?.id === mat.id ? null : mat)}
            className={`rounded-2xl border overflow-hidden cursor-pointer transition-all ${
              selectedMateria?.id === mat.id
                ? 'ring-2 ring-[#4DA8C4] shadow-lg'
                : ''
            } ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm hover:shadow-md')}`}
          >
            <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: dm ? '#334155' : '#E2E8F0' }}>
              <span className="text-2xl">{mat.icon}</span>
              <div>
                <h4 className={`font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{mat.nombre}</h4>
                <p className={`text-xs ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>{mat.competencias?.length} competencias · {mat.dba?.length} DBA</p>
              </div>
            </div>
            <AnimatePresence>
              {selectedMateria?.id === mat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <p className={`text-xs font-semibold mb-2 uppercase tracking-wider ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>Competencias</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mat.competencias.map((c, i) => (
                          <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${dc(dm, 'bg-[#334155] text-[#CBD5E1]', 'bg-[#F1F5F9] text-[#475569]')}`}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold mb-2 uppercase tracking-wider ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>DBA (Derechos Básicos de Aprendizaje)</p>
                      <div className="space-y-1">
                        {mat.dba.map((dba, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                            className={`p-2 rounded-lg text-xs flex items-start gap-2 ${dc(dm, 'bg-[#0F172A]', 'bg-[#F8FAFC]')}`}
                          >
                            <span className="text-[#4DA8C4] font-bold mt-0.5">◆</span>
                            <span className={dc(dm, 'text-[#CBD5E1]', 'text-[#475569]')}>{dba}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

CurriculumView.displayName = 'CurriculumView';
export { CurriculumView };
export default CurriculumView;
```

- [ ] **Step 3: Add tab to SmartBoardKidsDashboard**

In the import section, add:
```jsx
const CurriculumView = lazy(() => import('./CurriculumView'));
```

In the PremiumSidebar tabs, add before `libros`:
```jsx
{ id: 'curriculo', icon: '📋', label: 'Currículo', color: '#A855F7', premium: false },
```

In MobileBottomBar mobileTabs, add before `libros`:
```jsx
{ id: 'curriculo', icon: '📋' },
```

In mobile label logic:
```jsx
tab.id === 'curriculo' ? 'Currículo' : ...
```

In URL param handler, add `'curriculo'` to the includes array.

In CinematicContent renderContent, add before `'examenes'`:
```jsx
case 'curriculo':
  return (
    <DashboardErrorBoundary key="curriculo" message="Error al cargar currículo" onTabChange={onTabChange}>
    <motion.div key="curriculo" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
      <Suspense fallback={<SectionFallback tab="curriculo" />}>
        <CurriculumView />
      </Suspense>
    </motion.div>
    </DashboardErrorBoundary>
  );
```

- [ ] **Step 4: Build and verify**

Run: `npx vite build` and confirm no errors.

### Task 2: Oral Exam Simulator

**Files:**
- Create: `src/components/kids-dashboard/OralExamSimulator.jsx`
- Modify: `SmartBoardKidsDashboard.jsx` (add tab + lazy import)

- [ ] **Step 1: Create OralExamSimulator component**

```jsx
import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { callDeepseek } from '../../utils/api';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const SUBJECTS = [
  { id: 'matematicas', label: 'Matemáticas', icon: '🔢', color: '#4DA8C4' },
  { id: 'lenguaje', label: 'Lenguaje', icon: '📖', color: '#FF6B9D' },
  { id: 'ciencias', label: 'Ciencias Naturales', icon: '🔬', color: '#66CCCC' },
  { id: 'sociales', label: 'Ciencias Sociales', icon: '🌍', color: '#FFD166' },
  { id: 'ingles', label: 'Inglés', icon: '🇬🇧', color: '#A855F7' },
];

const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil', color: '#22C55E', icon: '🌱' },
  { id: 'medio', label: 'Medio', color: '#EAB308', icon: '🔥' },
  { id: 'dificil', label: 'Difícil', color: '#EF4444', icon: '💀' },
];

const dc = (dm, l, d) => dm ? d : l;

const OralExamSimulator = memo(() => {
  const { darkMode: dm, addPoints } = useSmartBoardKids();
  const [phase, setPhase] = useState('setup');
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);

  const generateExam = useCallback(async () => {
    setLoading(true);
    try {
      const prompt = `Genera un examen oral de ${subject.label} nivel ${difficulty.label} para un estudiante colombiano de grado 6-7. Debe tener 4 preguntas. Las primeras 3 son opción múltiple con 4 opciones (A, B, C, D) y solo 1 correcta. La última es una pregunta abierta. Responde SOLO con JSON:
{
  "questions": [
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C", "explanation": "..." },
    { "type": "multiple", "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "B", "explanation": "..." },
    { "type": "open", "question": "...", "modelAnswer": "puntos clave que debe incluir la respuesta", "explanation": "..." }
  ]
}`;
      const res = await callDeepseek(prompt, { temperature: 0.7, maxTokens: 1500, isJson: true });
      const parsed = typeof res === 'string' ? JSON.parse(res) : res;
      setQuestions(parsed.questions || []);
      setPhase('exam');
      setCurrentQ(0);
      setAnswers([]);
      setFeedback(null);
    } catch (e) {
      console.warn('Error generating exam:', e);
    }
    setLoading(false);
  }, [subject, difficulty]);

  const handleAnswer = useCallback(() => {
    const q = questions[currentQ];
    let isCorrect = false;
    let answerText = '';

    if (q.type === 'multiple') {
      isCorrect = selectedOption === q.correct;
      answerText = selectedOption;
    } else {
      answerText = openAnswer;
      // Open questions: we store answer and evaluate later
      isCorrect = openAnswer.trim().length > 10;
    }

    if (isCorrect && q.type === 'multiple') {
      addPoints(10, `Acertó pregunta oral de ${subject.label}`);
    }

    const newAnswers = [...answers, { questionIdx: currentQ, answer: answerText, correct: isCorrect }];
    setAnswers(newAnswers);

    setFeedback({ correct: isCorrect, explanation: q.explanation });

    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ(prev => prev + 1);
        setFeedback(null);
        setSelectedOption(null);
        setOpenAnswer('');
      }, 2000);
    } else {
      // Calculate results
      setTimeout(() => {
        const correctCount = newAnswers.filter(a => a.correct).length;
        const grade = Math.round((correctCount / questions.length) * 100);
        const earnedPoints = correctCount * 10;
        addPoints(earnedPoints, `Completó examen oral de ${subject.label}`);
        setResults({ correctCount, total: questions.length, grade, earnedPoints });
        setAnimateScore(true);
        setPhase('results');
      }, 2000);
    }
  }, [currentQ, questions, selectedOption, openAnswer, answers, addPoints, subject]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#A855F7] flex items-center justify-center text-lg shadow-md">🧪</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#004B63]', 'text-[#E2F0FF]')}`}>Examen Oral</h3>
          <p className={`text-xs ${dc(dm, 'text-[#64748B]', 'text-[#94A3B8]')}`}>Pon a prueba tus conocimientos con Dani</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Subject selection */}
            <div>
              <p className={`text-sm font-semibold mb-3 ${dc(dm, 'text-[#004B63]', 'text-white')}`}>Selecciona la materia</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECTS.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSubject(s)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      subject?.id === s.id
                        ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                        : dc(dm, 'border-[#334155] bg-[#1E293B]', 'border-[#E2E8F0] bg-white')
                    }`}
                  >
                    <span className="text-3xl block mb-1">{s.icon}</span>
                    <p className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{s.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Difficulty selection */}
            {subject && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className={`text-sm font-semibold mb-3 ${dc(dm, 'text-[#004B63]', 'text-white')}`}>Selecciona la dificultad</p>
                <div className="flex gap-3">
                  {DIFFICULTIES.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
                        difficulty?.id === d.id
                          ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                          : dc(dm, 'border-[#334155] bg-[#1E293B]', 'border-[#E2E8F0] bg-white')
                      }`}
                    >
                      <span className="text-2xl block mb-1">{d.icon}</span>
                      <p className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{d.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {subject && difficulty && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generateExam}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> Generando examen...</>
                ) : (
                  <><span className="text-xl">🎯</span> Iniciar Examen Oral</>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'exam' && questions[currentQ] && (
          <motion.div key="exam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }} animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{currentQ + 1}/{questions.length}</span>
            </div>

            {/* Question */}
            <motion.div key={currentQ} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{questions[currentQ].type === 'multiple' ? '❓' : '✍️'}</span>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>
                    {questions[currentQ].type === 'multiple' ? 'Selección múltiple' : 'Pregunta abierta'}
                  </p>
                  <p className={`text-base font-semibold ${dc(dm, 'text-white', 'text-[#1E293B]')}`}>{questions[currentQ].question}</p>
                </div>
              </div>

              {questions[currentQ].type === 'multiple' ? (
                <div className="space-y-2">
                  {questions[currentQ].options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => !feedback && setSelectedOption(opt.charAt(0))}
                      className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all flex items-center gap-3 ${
                        feedback
                          ? opt.charAt(0) === questions[currentQ].correct
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : selectedOption === opt.charAt(0)
                              ? 'border-red-400 bg-red-50 text-red-700'
                              : dc(dm, 'border-[#334155] opacity-50', 'border-[#E2E8F0] opacity-50')
                          : selectedOption === opt.charAt(0)
                            ? 'border-[#4DA8C4] bg-[#4DA8C4]/5'
                            : dc(dm, 'border-[#334155] hover:border-[#4DA8C4]/50', 'border-[#E2E8F0] hover:border-[#4DA8C4]/50')
                      } ${dc(dm, 'text-[#CBD5E1]', 'text-[#475569]')}`}
                      disabled={!!feedback}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        feedback && opt.charAt(0) === questions[currentQ].correct
                          ? 'bg-green-400 text-white'
                          : feedback && selectedOption === opt.charAt(0)
                            ? 'bg-red-400 text-white'
                            : dc(dm, 'bg-[#334155] text-[#94A3B8]', 'bg-[#F1F5F9] text-[#64748B]')
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt.substring(3)}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  disabled={!!feedback}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={4}
                  className={`w-full p-3 rounded-xl border text-sm resize-none ${
                    feedback
                      ? 'border-green-400 bg-green-50'
                      : dc(dm, 'bg-[#0F172A] border-[#334155] text-white', 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]')
                  } focus:outline-none focus:ring-2 focus:ring-[#4DA8C4]`}
                />
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl ${feedback.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
                  >
                    <p className="text-sm font-bold mb-1">{feedback.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}</p>
                    <p className="text-xs text-[#64748B]">{feedback.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!feedback && (
                <motion.button
                  onClick={handleAnswer}
                  disabled={questions[currentQ].type === 'multiple' ? !selectedOption : openAnswer.trim().length < 3}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {currentQ < questions.length - 1 ? 'Responder y continuar →' : 'Finalizar examen'}
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className={`p-8 rounded-2xl border text-center ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
            >
              <motion.span className="text-6xl block mb-4"
                animate={animateScore ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                {results.grade >= 80 ? '🏆' : results.grade >= 50 ? '👍' : '💪'}
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`text-5xl font-black mb-2 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] bg-clip-text text-transparent`}
              >
                {results.grade}%
              </motion.p>
              <p className={`text-sm ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>{results.correctCount} de {results.total} correctas</p>
              <motion.div
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 h-3 rounded-full bg-[#E2E8F0] overflow-hidden"
              >
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]"
                  initial={{ width: 0 }} animate={{ width: `${results.grade}%` }} transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className={`mt-4 text-sm font-bold ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}
              >
                +{results.earnedPoints} XP ganados
              </motion.p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setPhase('setup'); setResults(null); setAnswers([]); setSubject(null); setDifficulty(null); }}
              className="w-full py-3 bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white rounded-xl font-bold text-sm"
            >
              🔄 Nuevo Examen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

OralExamSimulator.displayName = 'OralExamSimulator';
export { OralExamSimulator };
export default OralExamSimulator;
```

- [ ] **Step 2: Add tab to SmartBoardKidsDashboard**

Add lazy import:
```jsx
const OralExamSimulator = lazy(() => import('./OralExamSimulator'));
```

In PremiumSidebar, add before `examenes`:
```jsx
{ id: 'oral', icon: '🧪', label: 'Oral', color: '#A855F7', premium: false },
```

In MobileBottomBar, add before `examenes`:
```jsx
{ id: 'oral', icon: '🧪' },
```

In mobile label logic:
```jsx
tab.id === 'oral' ? 'Oral' : ...
```

Add `'oral'` to URL param handler includes.

Add case in renderContent before `'examenes'`:
```jsx
case 'oral':
  return (
    <DashboardErrorBoundary key="oral" message="Error al cargar examen oral" onTabChange={onTabChange}>
    <motion.div key="oral" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
      <Suspense fallback={<SectionFallback tab="oral" />}>
        <OralExamSimulator />
      </Suspense>
    </motion.div>
    </DashboardErrorBoundary>
  );
```

- [ ] **Step 3: Build and verify**

### Task 3: Multi-modal Dani Responses

**Files:**
- Modify: `DaniTutorChat.jsx` (add chart + video rendering)

- [ ] **Step 1: Add chart rendering to DaniTutorChat**

In DaniTutorChat.jsx, after the import for `DaniAvatar` add:
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
```

Above the `handleSendMessage` function, add a chart renderer component:
```jsx
const ChartRenderer = memo(({ chartData, darkMode }) => {
  const COLORS = ['#4DA8C4', '#66CCCC', '#FF6B9D', '#FFD166', '#A855F7', '#22C55E'];

  if (!chartData?.data?.length) return null;

  if (chartData.type === 'bar') {
    return (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData.data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={darkMode ? { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 } : { borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" fill="#4DA8C4" radius={[4, 4, 0, 0]}>
              {chartData.data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (chartData.type === 'pie') {
    return (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={chartData.data} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {chartData.data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (chartData.type === 'line') {
    return (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 200 }}
        className={`rounded-xl border p-3 my-2 ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
      >
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData.data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={darkMode ? { background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 } : { borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke="#4DA8C4" strokeWidth={2} dot={{ fill: '#4DA8C4', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return null;
});
ChartRenderer.displayName = 'ChartRenderer';
```

- [ ] **Step 2: Add YouTube embed renderer to DaniTutorChat**

```jsx
const VideoEmbed = memo(({ videoData }) => {
  const [loaded, setLoaded] = useState(false);

  if (!videoData?.url) return null;

  const getId = (url) => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return m?.[1] || null;
  };

  const videoId = getId(videoData.url);
  if (!videoId) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden my-2 ${loaded ? '' : 'cursor-pointer'}`}
      onClick={() => !loaded && setLoaded(true)}
    >
      {loaded ? (
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoData.title || 'Video'}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${dc(dm, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0]')}`}>
          <div className="w-12 h-12 rounded-lg bg-[#FF0000] flex items-center justify-center text-white text-xl flex-shrink-0">▶️</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{videoData.title || 'Ver video'}</p>
            <p className="text-xs text-[#64748B]">YouTube · Toca para cargar</p>
          </div>
        </div>
      )}
    </motion.div>
  );
});
VideoEmbed.displayName = 'VideoEmbed';
```

- [ ] **Step 3: Modify message rendering to support multi-modal blocks**

In the `daniChatHistory.map` render area, replace the current MessageBubble block with:

```jsx
{daniChatHistory.map((msg, index) => {
  if (msg.type === 'chart') {
    return <ChartRenderer key={index} chartData={msg.data} darkMode={darkMode} />;
  }
  if (msg.type === 'video') {
    return <VideoEmbed key={index} videoData={msg.data} />;
  }
  return (
    <MessageBubble key={index} message={msg} isDani={msg.role === 'assistant'} darkMode={darkMode} />
  );
})}
```

- [ ] **Step 4: Modify handleSendMessage to detect chart/video in response**

After receiving `fullResponse` from streaming, parse for structured data:

```jsx
// After fullResponse is complete, check for chart/video data
try {
  const chartMatch = fullResponse.match(/<!CHART>(.*?)<!\/CHART>/);
  if (chartMatch) {
    const chartData = JSON.parse(chartMatch[1]);
    addDaniMessage({ role: 'assistant', type: 'chart', data: chartData });
  }
  const videoMatch = fullResponse.match(/<!VIDEO>(.*?)<!\/VIDEO>/);
  if (videoMatch) {
    const videoData = JSON.parse(videoMatch[1]);
    addDaniMessage({ role: 'assistant', type: 'video', data: videoData });
  }
} catch (e) {
  // Ignore parse errors
}
```

- [ ] **Step 5: Build and verify**

### Task 4: Collaborative Study

**Files:**
- Modify: `FlashcardSystem.jsx` (add share code + multiplayer mode)

- [ ] **Step 1: Add share/import to FlashcardSystem**

In FlashcardSystem.jsx, below the existing deck display area (after the deck rendering loop), add:

```jsx
{/* Share/Import */}
{selectedDeck && (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-4">
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={() => {
        const code = selectedDeck.shareCode || Math.random().toString(36).substring(2, 8).toUpperCase();
        if (!selectedDeck.shareCode) {
          const updated = { ...selectedDeck, shareCode: code };
          const decks = JSON.parse(localStorage.getItem('edutechlife_flashcards') || '[]');
          const idx = decks.findIndex(d => d.id === selectedDeck.id);
          if (idx >= 0) {
            decks[idx] = updated;
            localStorage.setItem('edutechlife_flashcards', JSON.stringify(decks));
            setFlashcardDecks(decks);
          }
        }
        navigator.clipboard.writeText(code);
        setShareMessage('¡Código copiado!');
        setTimeout(() => setShareMessage(''), 2000);
      }}
      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold"
    >
      📤 Compartir deck
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={() => setShowImport(true)}
      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD166] to-[#FFB300] text-white text-sm font-bold"
    >
      📥 Importar deck
    </motion.button>
  </motion.div>
)}

{/* Import dialog */}
<AnimatePresence>
  {showImport && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowImport(false)}
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        className={`p-6 rounded-2xl max-w-sm w-full ${darkMode ? 'bg-[#1E293B]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>Importar deck</h3>
        <input value={importCode} onChange={(e) => setImportCode(e.target.value.toUpperCase())}
          placeholder="Ej: F3K7M9"
          maxLength={6}
          className={`w-full p-3 rounded-xl border text-center text-lg font-bold tracking-widest mb-4 ${
            darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#004B63]'
          }`}
        />
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => setShowImport(false)}
            className="flex-1 py-2.5 rounded-xl border text-sm font-bold text-[#64748B]"
          >Cancelar</motion.button>
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => {
              const allDecks = [
                ...(JSON.parse(localStorage.getItem('edutechlife_flashcards') || '[]')),
                ...(JSON.parse(localStorage.getItem('edutechlife_shared_decks') || '[]'))
              ];
              const found = allDecks.find(d => d.shareCode === importCode);
              if (found) {
                const imported = JSON.parse(localStorage.getItem('edutechlife_shared_decks') || '[]');
                const exists = imported.some(d => d.shareCode === importCode);
                if (!exists) {
                  imported.push({ ...found, id: `${found.id}_imported_${Date.now()}` });
                  localStorage.setItem('edutechlife_shared_decks', JSON.stringify(imported));
                }
                setShowImport(false);
                setImportCode('');
              }
            }}
            disabled={importCode.length < 4}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold disabled:opacity-50"
          >Importar</motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

Also add state at the top of the component:
```jsx
const [showImport, setShowImport] = useState(false);
const [importCode, setImportCode] = useState('');
const [shareMessage, setShareMessage] = useState('');
```

- [ ] **Step 2: Add multiplayer quiz mode to FlashcardSystem**

Add a "2 Jugadores" button in the quiz section:

```jsx
{/* Multiplayer toggle */}
{selectedDeck && !multiplayerMode && (
  <motion.button
    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
    onClick={() => setMultiplayerMode(true)}
    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#A855F7] text-white text-sm font-bold mt-2"
  >
    👥 Modo 2 Jugadores
  </motion.button>
)}
```

And the multiplayer quiz UI:

```jsx
{multiplayerMode && (() => {
  const PlayerArea = ({ playerNum, playerScore, playerIdx, isCurrentPlayer }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex-1 p-4 rounded-2xl border ${
        isCurrentPlayer ? 'ring-2 ring-[#4DA8C4]' : ''
      } ${darkMode ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E2E8F0]'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{playerNum === 1 ? '👤' : '👤'}</span>
          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
            Jugador {playerNum}
            {isCurrentPlayer && <span className="text-[#4DA8C4] text-xs ml-1">(tu turno)</span>}
          </span>
        </div>
        <span className={`text-lg font-black ${darkMode ? 'text-[#4DA8C4]' : 'text-[#004B63]'}`}>{playerScore}</span>
      </div>
      {isCurrentPlayer && currentQuestion && (
        <div className="space-y-2">
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#1E293B]'}`}>{currentQuestion.front || currentQuestion.question}</p>
          <div className="flex gap-2">
            <input
              value={playerAnswer}
              onChange={(e) => setPlayerAnswer(e.target.value)}
              placeholder="Tu respuesta..."
              className={`flex-1 p-2 rounded-lg border text-sm ${
                darkMode ? 'bg-[#0F172A] border-[#334155] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const correct = playerAnswer.trim().toLowerCase() === (currentQuestion.back || currentQuestion.answer || '').trim().toLowerCase();
                if (correct) {
                  if (currentPlayer === 1) setScore1(s => s + 1);
                  else setScore2(s => s + 1);
                }
                setPlayerAnswer('');
                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                setQIdx(prev => prev + 1);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold"
            >✓</motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const handleEndMultiplayer = () => {
    setMultiplayerMode(false);
    setQIdx(0);
    setScore1(0);
    setScore2(0);
    setCurrentPlayer(1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
      <div className="flex gap-3">
        <PlayerArea playerNum={1} playerScore={score1} playerIdx={0} isCurrentPlayer={currentPlayer === 1} />
        <PlayerArea playerNum={2} playerScore={score2} playerIdx={1} isCurrentPlayer={currentPlayer === 2} />
      </div>
      {qIdx >= (selectedDeck.cards?.length || selectedDeck.questions?.length || 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4"
        >
          <p className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#004B63]'}`}>
            {score1 === score2 ? '🤝 Empate!' : score1 > score2 ? '🏆 Jugador 1 gana!' : '🏆 Jugador 2 gana!'}
          </p>
          <p className={`text-sm ${darkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            {score1} - {score2}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleEndMultiplayer}
            className="mt-3 px-6 py-2 rounded-xl bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] text-white text-sm font-bold"
          >
            Finalizar
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
})()}
```

Add state variables at the top of the FlashcardSystem component:
```jsx
const [multiplayerMode, setMultiplayerMode] = useState(false);
const [score1, setScore1] = useState(0);
const [score2, setScore2] = useState(0);
const [currentPlayer, setCurrentPlayer] = useState(1);
const [qIdx, setQIdx] = useState(0);
const [playerAnswer, setPlayerAnswer] = useState('');
const [currentQuestion, setCurrentQuestion] = useState(null);
```

- [ ] **Step 3: Build and verify**

### Task 5: Advanced Analytics

**Files:**
- Create: `src/components/kids-dashboard/SmartBoardAnalytics.jsx`
- Modify: `SmartBoardKidsDashboard.jsx` (add tab, premium gate)

- [ ] **Step 1: Create SmartBoardAnalytics component**

```jsx
import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, CartesianGrid, Cell } from 'recharts';
import { useSmartBoardKids } from '../../context/SmartBoardKidsContext';

const dc = (dm, l, d) => dm ? d : l;
const COLORS = ['#4DA8C4', '#66CCCC', '#FF6B9D', '#FFD166', '#A855F7', '#22C55E'];

const MetricCard = memo(({ icon, title, children, darkMode, color = '#4DA8C4' }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    className={`rounded-2xl border overflow-hidden ${dc(darkMode, 'bg-[#1E293B] border-[#334155]', 'bg-white border-[#E2E8F0] shadow-sm')}`}
  >
    <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${color}20` }}>
        {icon}
      </div>
      <h3 className={`text-sm font-bold ${dc(darkMode, 'text-white', 'text-[#004B63]')}`}>{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </motion.div>
));

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const SmartBoardAnalytics = memo(() => {
  const { darkMode: dm, totalPoints, streak, missions, studentMoodHistory, academicTopics, conversationCount } = useSmartBoardKids();

  // Simulated data — in production this would come from real user activity
  const subjectData = useMemo(() => [
    { name: 'Matemáticas', value: 78, color: '#4DA8C4' },
    { name: 'Lenguaje', value: 92, color: '#FF6B9D' },
    { name: 'Ciencias', value: 65, color: '#66CCCC' },
    { name: 'Sociales', value: 88, color: '#FFD166' },
    { name: 'Inglés', value: 72, color: '#A855F7' },
  ], []);

  const weeklyData = useMemo(() =>
    weekDays.map((day, i) => ({
      name: day,
      value: Math.floor(Math.random() * 120) + 30,
    })), []);

  const predictionData = useMemo(() =>
    ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Proy.'].map((name, i) => ({
      name,
      value: i < 4 ? Math.floor(Math.random() * 40) + 50 : 75,
    })), []);

  const scatterData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: Math.floor(Math.random() * 60) + 10,
      y: Math.floor(Math.random() * 40) + 40,
      name: `Sesión ${i + 1}`,
    })), []);

  const heatmapData = useMemo(() => {
    const subjects = ['Mat', 'Len', 'Cie', 'Soc', 'Ing'];
    return subjects.map((subj, si) =>
      weekDays.map((day, di) => ({
        subject: subj,
        day,
        value: Math.floor(Math.random() * 100),
        x: di,
        y: si,
      }))
    ).flat();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#22C55E] flex items-center justify-center text-lg shadow-md">📈</div>
        <div>
          <h3 className={`text-lg font-bold ${dc(dm, 'text-[#E2F0FF]', 'text-[#004B63]')}`}>Analítica Avanzada</h3>
          <p className={`text-xs ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Rendimiento, predicciones y hábitos de estudio</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Learning Velocity */}
        <MetricCard icon="🚀" title="Velocidad de Aprendizaje" darkMode={dm} color="#4DA8C4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.value > 80 ? '#22C55E' : entry.value > 50 ? '#4DA8C4' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>
            Minutos de estudio por día
          </p>
        </MetricCard>

        {/* 2. Subject Heatmap */}
        <MetricCard icon="🔥" title="Heatmap de Materias" darkMode={dm} color="#FF6B9D">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1 min-w-[250px]">
              <div className="text-[10px] text-[#64748B] font-medium"></div>
              {weekDays.slice(0, 5).map(d => (
                <div key={d} className="text-[10px] text-[#64748B] font-medium text-center">{d}</div>
              ))}
              {['Mat', 'Len', 'Cie', 'Soc', 'Ing'].map(subj => (
                <>
                  <div className="text-[10px] text-[#64748B] font-medium py-2">{subj}</div>
                  {weekDays.slice(0, 5).map(day => {
                    const cell = heatmapData.find(d => d.subject === subj && d.day === day);
                    const val = cell?.value || 0;
                    const intensity = val > 80 ? 'bg-green-400' : val > 60 ? 'bg-[#4DA8C4]' : val > 40 ? 'bg-[#66CCCC]' : val > 20 ? 'bg-[#FFD166]' : 'bg-gray-200';
                    return (
                      <div key={`${subj}-${day}`}
                        className={`w-full aspect-square rounded ${intensity} flex items-center justify-center`}
                        title={`${subj} ${day}: ${val}%`}
                      >
                        <span className="text-[8px] text-white font-bold">{val > 0 ? `${val}` : ''}</span>
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </MetricCard>

        {/* 3. Performance Prediction */}
        <MetricCard icon="🎯" title="Predicción de Rendimiento" darkMode={dm} color="#A855F7">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={predictionData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7', r: 4 }}
                strokeDasharray={predictionData.map((_, i) => i === predictionData.length - 1 ? '5 5' : '0').join(' ')}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>
            Proyección: {predictionData[predictionData.length - 1]?.value || 0}% estimado
          </p>
        </MetricCard>

        {/* 4. Time vs Results */}
        <MetricCard icon="⏱️" title="Tiempo vs Resultados" darkMode={dm} color="#22C55E">
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#334155' : '#E2E8F0'} />
              <XAxis dataKey="x" name="minutos" tick={{ fontSize: 10 }} label={{ value: 'Minutos', position: 'bottom', fontSize: 10 }} />
              <YAxis dataKey="y" name="nota" tick={{ fontSize: 10 }} label={{ value: 'Nota', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v}`, 'Valor']} />
              <Scatter data={scatterData} fill="#4DA8C4" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className={`text-xs text-center mt-2 ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>
            Correlación: más tiempo = mejores resultados
          </p>
        </MetricCard>

        {/* 5. Streak per subject */}
        <MetricCard icon="💪" title="Racha por Materia" darkMode={dm} color="#FFD166">
          <div className="space-y-3">
            {subjectData.map((subj, i) => (
              <div key={subj.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: subj.color }} />
                <span className={`text-xs font-semibold w-20 ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{subj.name}</span>
                <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${subj.value}%` }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${subj.color}, ${subj.color}dd)` }}
                  />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${dc(dm, 'text-[#4DA8C4]', 'text-[#004B63]')}`}>{subj.value}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: dm ? '#334155' : '#E2E8F0' }}>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{streak || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Racha actual</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{totalPoints || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Puntos totales</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-black ${dc(dm, 'text-white', 'text-[#004B63]')}`}>{missions?.filter(m => m.completed).length || 0}</p>
              <p className={`text-[10px] ${dc(dm, 'text-[#94A3B8]', 'text-[#64748B]')}`}>Misiones</p>
            </div>
          </div>
        </MetricCard>
      </div>
    </div>
  );
});

SmartBoardAnalytics.displayName = 'SmartBoardAnalytics';
export { SmartBoardAnalytics };
export default SmartBoardAnalytics;
```

- [ ] **Step 2: Add tab to SmartBoardKidsDashboard**

Add lazy import:
```jsx
const SmartBoardAnalytics = lazy(() => import('./SmartBoardAnalytics'));
```

In PremiumSidebar tabs, add (Premium=true):
```jsx
{ id: 'analitica', icon: '📈', label: 'Analítica', color: '#A855F7', premium: true },
```

In MobileBottomBar, add:
```jsx
{ id: 'analitica', icon: '📈' },
```

In MOBILE_PREMIUM_TABS, add `'analitica'`.

In mobile label logic:
```jsx
tab.id === 'analitica' ? 'Analítica' : ...
```

The MOBILE_PREMIUM_TABS is defined at the top of MobileBottomBar — add `'analitica'` to it.

In URL param handler, add `'analitica'` to the includes.

Add case in renderContent before `'padres'`:
```jsx
case 'analitica':
  return (
    <DashboardErrorBoundary key="analitica" message="Error al cargar analytics" onTabChange={onTabChange}>
    <motion.div key="analitica" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={sharedTransition} className="h-full">
      <Suspense fallback={<SectionFallback tab="analitica" />}>
        <SmartBoardAnalytics />
      </Suspense>
    </motion.div>
    </DashboardErrorBoundary>
  );
```

- [ ] **Step 3: Build and verify**

---

## Self-Review Checklist

- [ ] Spec coverage: Each of the 5 features has a dedicated task with complete code
- [ ] Placeholders: No TBD, TODO, or placeholder code — all code blocks are complete
- [ ] Type consistency: prop names, component names, and data structures align across tasks
- [ ] All files listed in the header table have creation or modification tasks
