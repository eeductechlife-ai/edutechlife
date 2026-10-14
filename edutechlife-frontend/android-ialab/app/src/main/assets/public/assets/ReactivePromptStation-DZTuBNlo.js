import{d as ce,cK as le,ch as l,d3 as pe,c7 as r,cc as X,aa as E}from"./index-Voi6mD1E.js";import{c as j}from"./IALab-B43vjI71.js";import"./legacy-Ct1nl3DC.js";import"./synthesis-DbyuAgTV.js";import"./voiceUtils-DMwJvhds.js";/* empty css               */import"./UserDropdownMenuSimplified-DS2pjR9N.js";import"./JsonLd-6yt59gJf.js";import"./MaxAvatar-C8kNpLF3.js";import"./useSessionTracker-CMcIFXhb.js";const me={CLARITY:{weight:.3,indicators:[{pattern:/\?$/,score:20},{pattern:/^(como|qué|por qué|cómo|cuál)/i,score:15},{pattern:/(explica|describe|analiza|crea|compara)/i,score:25},{pattern:/\.\s*$/,score:10},{pattern:/\n/,score:-10}]},SPECIFICITY:{weight:.25,indicators:[{pattern:/\d+/,score:20},{pattern:/(palabras|caracteres|párrafos|puntos)/i,score:25},{pattern:/(ejemplo|ejemplos)/i,score:15},{pattern:/(máximo|mínimo|al menos)/i,score:20},{pattern:/\b(y|o|pero)\b/gi,score:-5,max:-15}]},CONTEXT:{weight:.25,indicators:[{pattern:/(como|actúa como|eres un|desde la perspectiva)/i,score:30},{pattern:/(para|con el objetivo de|con el fin de)/i,score:20},{pattern:/(contexto|antecedentes|información de fondo)/i,score:25},{pattern:/(audiencia|lector|usuario)/i,score:15},{pattern:/^\w{1,10}$/,score:-30}]},STRUCTURE:{weight:.2,indicators:[{pattern:/(\d+\.|-|\*)\s/,score:25},{pattern:/(paso|etapa|fase)/i,score:20},{pattern:/(primero|luego|después|finalmente)/i,score:15},{pattern:/(introducción|desarrollo|conclusión)/i,score:30},{pattern:/.{100,}/,score:-10}]}},ue=[{pattern:/^.{0,15}$/,problem:"Demasiado corto",suggestion:"Añade más detalles y contexto"},{pattern:/^[^?]*$/,problem:"Falta pregunta clara",suggestion:"Formula una pregunta específica"},{pattern:/\b(haz|hazme|dame)\b/i,problem:"Verbo genérico",suggestion:'Usa verbos específicos como "analiza", "crea", "compara"'},{pattern:/\b(algo|cosas|stuff)\b/i,problem:"Términos vagos",suggestion:"Sé específico sobre lo que necesitas"},{pattern:/^[A-Z][^.!?]{0,50}$/,problem:"Falta puntuación",suggestion:"Usa puntuación adecuada para claridad"},{pattern:/\b(y|o)\b.{0,5}\b(y|o)\b.{0,5}\b(y|o)\b/i,problem:"Demasiadas opciones",suggestion:"Enfócate en una tarea principal"}],W=e=>{if(!e||e.trim().length===0)return{score:0,analysis:{clarity:0,specificity:0,context:0,structure:0},commonProblems:["Prompt vacío"],suggestions:["Escribe un prompt para analizar"]};const t={};let a=0;for(const[n,h]of Object.entries(me)){let f=50;for(const u of h.indicators){const g=e.match(u.pattern);if(g){let v=u.score;if(u.max&&v<0){const A=u.max,d=g.length;v=Math.max(v*d,A)}else g.length>1&&(v*=g.length);f+=v}}f=Math.max(0,Math.min(100,f)),t[n.toLowerCase()]=f,a+=f*h.weight}const o=[];for(const n of ue)e.match(n.pattern)&&o.push({problem:n.problem,suggestion:n.suggestion});const s=Math.round(a),i=de(t,o);return{score:s,analysis:t,commonProblems:o,suggestions:i,wordCount:e.split(/\s+/).length,charCount:e.length}},de=(e,t)=>{const a=[];e.clarity<60&&a.push('Añade más claridad usando verbos de acción específicos (ej: "analiza", "crea", "compara")'),e.specificity<50&&a.push('Sé más específico sobre el resultado esperado (ej: "500 palabras", "3 ejemplos", "formato de lista")'),e.context<40&&a.push('Proporciona más contexto (ej: "Como experto en...", "Para una audiencia de...")'),e.structure<30&&a.push('Usa una estructura clara (ej: "1. Primero... 2. Luego... 3. Finalmente...")');for(const o of t.slice(0,3))a.push(o.suggestion);return Object.values(e).some(o=>o<30)&&a.push("Considera usar el formato RTF: Rol + Tarea + Formato"),a.slice(0,5)},te=e=>e>=80?{level:"Excelente",color:"#10B981",emoji:"🏆"}:e>=60?{level:"Bueno",color:"#3B82F6",emoji:"👍"}:e>=40?{level:"Aceptable",color:"#F59E0B",emoji:"⚠️"}:{level:"Necesita mejora",color:"#EF4444",emoji:"🔧"},D=e=>{const t=e.toLowerCase();return t.includes("analiza")||t.includes("explica")||t.includes("por qué")?{type:"Analítico",technique:"Chain-of-Thought",icon:"🔍"}:t.includes("crea")||t.includes("escribe")||t.includes("genera")?{type:"Creativo",technique:"Role Play",icon:"🎨"}:t.includes("ejemplo")||t.includes("como hacer")||t.includes("paso a paso")?{type:"Instruccional",technique:"Few-Shot",icon:"📋"}:t.includes("compara")||t.includes("diferencias")||t.includes("ventajas")?{type:"Comparativo",technique:"Structured Comparison",icon:"⚖️"}:{type:"General",technique:"Clear Instructions",icon:"💬"}},Y=e=>{const t=["el","la","los","las","un","una","unos","unas","de","del","al","y","o","pero","con"],a=e.toLowerCase().replace(/[^\w\s]/g," ").split(/\s+/).filter(s=>s.length>3&&!t.includes(s)),o={};return a.forEach(s=>{o[s]=(o[s]||0)+1}),Object.entries(o).sort((s,i)=>i[1]-s[1]).slice(0,5).map(([s])=>s)},C={CHAIN_OF_THOUGHT:{name:"Chain-of-Thought",description:"Para prompts analíticos que requieren razonamiento paso a paso",icon:"🔍",color:"#3B82F6",apply:re},FEW_SHOT:{name:"Few-Shot Learning",description:"Para tareas que se benefician de ejemplos concretos",icon:"📚",color:"#10B981",apply:fe},ROLE_PLAY:{name:"Role Play",description:"Para contenido que requiere perspectiva profesional o creativa",icon:"🎭",color:"#8B5CF6",apply:ge},STRUCTURED_OUTPUT:{name:"Structured Output",description:"Para respuestas que necesitan formato específico",icon:"📋",color:"#F59E0B",apply:xe},META_PROMPTING:{name:"Meta-Prompting",description:"Para prompts sobre prompts o análisis de calidad",icon:"🎯",color:"#EF4444",apply:be}},Z={analítico:[{input:"Analiza las ventas del último trimestre",output:`1. Crecimiento trimestral: +15%
2. Producto líder: Software Educativo
3. Región más fuerte: Latinoamérica
4. Recomendación: Expandir campañas digitales`},{input:"Explica cómo funciona la fotosíntesis",output:`La fotosíntesis es el proceso donde las plantas convierten luz solar en energía. Pasos:
1. Absorción de luz
2. Conversión de CO2
3. Producción de glucosa
4. Liberación de oxígeno`}],creativo:[{input:"Escribe un poema sobre la primavera",output:`La primavera llega con su manto verde,
flores que al viento su fragancia ceden,
pájaros cantan en el amanecer,
renace la vida en cada mujer.`},{input:"Crea una historia corta de ciencia ficción",output:'En el año 2150, la IA "Eureka" descubrió cómo revertir el cambio climático. Pero su solución requería un sacrificio: desconectar todas las redes sociales por un año. La humanidad debía elegir entre conveniencia y supervivencia.'}],instruccional:[{input:"Cómo hacer una presentación efectiva",output:`1. Comienza con un dato impactante
2. Estructura en 3 partes: problema, solución, acción
3. Usa imágenes, no texto denso
4. Practica el timing
5. Prepara Q&A`},{input:"Pasos para aprender programación",output:`1. Elige un lenguaje (Python recomendado)
2. Aprende sintaxis básica
3. Practica con ejercicios pequeños
4. Construye un proyecto personal
5. Contribuye a código abierto`}]},he=(e,t)=>{const a=D(e),{type:o}=a;switch(o){case"Analítico":return C.CHAIN_OF_THOUGHT;case"Creativo":return C.ROLE_PLAY;case"Instruccional":return C.FEW_SHOT;case"Comparativo":return C.STRUCTURED_OUTPUT;default:return t.clarity<50?C.STRUCTURED_OUTPUT:t.specificity<40?C.FEW_SHOT:t.context<30?C.ROLE_PLAY:C.CHAIN_OF_THOUGHT}};function re(e,t){const a=Y(e);return`Piensa paso a paso como un experto:

PROBLEMA: "${e}"

ANÁLISIS SISTEMÁTICO:

1. **COMPRENSIÓN DEL PROBLEMA**
   • ¿Qué se está pidiendo exactamente?
   • ¿Cuál es el contexto implícito?
   • ¿Qué información clave se necesita?

2. **DESGLOSE DE COMPONENTES**
   • Elementos principales: ${a.slice(0,3).join(", ")}
   • Relaciones entre componentes
   • Supuestos que deben validarse

3. **APLICACIÓN DE MÉTODOS**
   • Enfoque más apropiado para este tipo de problema
   • Herramientas o frameworks relevantes
   • Consideraciones especiales

4. **DESARROLLO DE SOLUCIÓN**
   • Paso 1: [Acción inicial]
   • Paso 2: [Proceso intermedio]
   • Paso 3: [Conclusión/Resultado]

5. **VALIDACIÓN Y RETROALIMENTACIÓN**
   • ¿La solución cumple con todos los requisitos?
   • Limitaciones o advertencias importantes
   • Posibles mejoras o iteraciones

FORMATO DE RESPUESTA:
• Usa encabezados claros (##)
• Incluye ejemplos concretos cuando sea relevante
• Mantén un tono profesional pero accesible
• Limita la respuesta a 500-700 palabras`}function fe(e,t){const a=D(e),s=(Z[a.type.toLowerCase()]||Z.instruccional).map((i,n)=>`EJEMPLO ${n+1}:
Input: "${i.input}"
Output: "${i.output}"`).join(`

`);return`Basándote en estos ejemplos de ${a.type.toLowerCase()}:

${s}

Ahora, para este nuevo input:

INPUT: "${e}"

Por favor, genera una respuesta que:

1. SIGA EL MISMO FORMATO que los ejemplos
2. MANTENGA EL MISMO NIVEL DE DETALLE
3. USE UN TONO SIMILAR (${a.type==="Creativo"?"creativo y engaging":"profesional y claro"})
4. INCLUYA ${t.specificity<50?"MÁS":"LA MISMA"} ESPECIFICIDAD

Si el input requiere un enfoque diferente a los ejemplos, adapta apropiadamente pero mantén la calidad y estructura.

RECUERDA:
• Responde directamente al input proporcionado
• No copies los ejemplos, úsalos como guía
• Sé consistente en formato y profundidad`}function ge(e,t){const a={tecnología:"Ingeniero de Software Senior con 10 años de experiencia en startups",educación:"Pedagogo con maestría en metodologías innovadoras",negocios:"Consultor de estrategia para Fortune 500",creativo:"Escritor profesional ganador de premios literarios",ciencia:"Investigador con PhD y múltiples publicaciones"},o=Y(e);let s=a.creativo;for(const[i,n]of Object.entries(a))if(o.some(h=>h.includes(i.substring(0,4)))){s=n;break}return`Actúa como ${s}.

CONTEXTO PROFESIONAL:
• Experiencia: ${s.split("con")[1]?.trim()||"Extensa experiencia en el campo"}
• Especialización: ${s.split("con")[0]?.replace("Actúa como","").trim()||"Área relevante"}
• Enfoque: Resolver problemas complejos con soluciones prácticas

TAREA ASIGNADA:
"${e}"

DIRECTRICES ESPECÍFICAS:

1. **PERSPECTIVA PROFESIONAL**
   • Responde desde tu experiencia real en el campo
   • Usa terminología apropiada pero explica cuando sea necesario
   • Comparte insights basados en casos reales (sin nombres específicos)

2. **ENFOQUE PRÁCTICO**
   • Proporciona consejos aplicables inmediatamente
   • Incluye ejemplos de la vida real
   • Advierte sobre errores comunes y cómo evitarlos

3. **FORMATO DE RESPUESTA**
   • Introducción: Contextualiza desde tu expertise
   • Desarrollo: Explicación detallada con ejemplos
   • Conclusión: Resumen y próximos pasos
   • Extensión: ${t.wordCount<50?"500-700 palabras":"300-500 palabras"}

4. **TONO Y ESTILO**
   • ${t.context<40?"Educativo y claro":"Profesional y directo"}
   • Empático pero autoritativo
   • Motivador sin ser condescendiente

IMPORTANTE: Tu respuesta debe sonar genuinamente como ${s.toLowerCase()}, no como una IA generando texto.`}function xe(e,t){const a={lista:`• Punto 1: [Descripción]
• Punto 2: [Descripción]
• Punto 3: [Descripción]`,pasos:`1. Paso uno: [Acción]
2. Paso dos: [Acción] 
3. Paso tres: [Acción]`,comparación:`VENTAJAS:
• [Ventaja 1]
• [Ventaja 2]

DESVENTAJAS:
• [Desventaja 1]
• [Desventaja 2]

RECOMENDACIÓN: [Recomendación final]`,reporte:`RESUMEN EJECUTIVO:
[Resumen de 100 palabras]

HALLAZGOS PRINCIPALES:
1. [Hallazgo 1]
2. [Hallazgo 2]

RECOMENDACIONES:
• [Recomendación 1]
• [Recomendación 2]`};let o="lista";return(e.includes("paso")||e.includes("cómo hacer"))&&(o="pasos"),(e.includes("compara")||e.includes("ventajas"))&&(o="comparación"),(e.includes("analiza")||e.includes("reporte"))&&(o="reporte"),`Genera una respuesta con estructura clara y definida:

SOLICITUD: "${e}"

REQUISITOS DE ESTRUCTURA:

FORMATO PRINCIPAL: ${o.toUpperCase()}

${a[o]}

PARÁMETROS ADICIONALES:

1. **LONGITUD:** ${t.wordCount<30?"Completa pero concisa (200-300 palabras)":"Detallada (400-600 palabras)"}
2. **TONO:** ${t.clarity<60?"Claro y educativo":"Profesional y directo"}
3. **NIVEL DE DETALLE:** ${t.specificity<50?"Alto - incluye ejemplos concretos":"Moderado - enfócate en puntos clave"}
4. **ELEMENTOS OBLIGATORIOS:**
   • Introducción breve que contextualice
   • Desarrollo estructurado según el formato
   • Conclusión que resuma puntos clave
   • ${t.context<40?"Explicación de términos técnicos si es necesario":"Uso apropiado de terminología especializada"}

5. **RESTRICCIONES:**
   • No uses marcadores markdown complejos (##, ###)
   • Mantén consistencia en el formato
   • Evita divagaciones fuera de la estructura
   • Prioriza claridad sobre creatividad en el formato

EJEMPLO DE RESPUESTA ESPERADA:
[Usa exactamente la estructura especificada arriba, completando los placeholders con contenido relevante para la solicitud]`}function be(e,t){return`Eres un experto en ingeniería de prompts con 5 años de experiencia optimizando prompts para IA.

ANÁLISIS SOLICITADO: Optimiza y mejora el siguiente prompt

PROMPT ORIGINAL: 
"${e}"

TU TAREA: Proporcionar un análisis detallado y 3 versiones mejoradas

---

**ANÁLISIS DE CALIDAD ACTUAL:**

PUNTUACIÓN: ${t.score}/100
• Claridad: ${t.clarity}/100
• Especificidad: ${t.specificity}/100  
• Contexto: ${t.context}/100
• Estructura: ${t.structure}/100

PROBLEMAS IDENTIFICADOS:
${t.commonProblems?.map(a=>`• ${a.problem}: ${a.suggestion}`).join(`
`)||"• Ninguno crítico identificado"}

---

**VERSIÓN OPTIMIZADA 1 (MEJOR GENERAL):**

🔹 ROL: [Rol específico apropiado]
🔹 TAREA: [Tarea clara y específica]
🔹 FORMATO: [Formato de salida definido]

📋 PROMPT MAESTRO:
"[Versión optimizada del prompt original con mejor claridad y estructura]"

🎯 MEJORAS APLICADAS:
• [Mejora 1 específica]
• [Mejora 2 específica]
• [Mejora 3 específica]

---

**VERSIÓN OPTIMIZADA 2 (ENFOQUE ALTERNATIVO):**

[Describe un enfoque diferente con ventajas específicas]

---

**VERSIÓN OPTIMIZADA 3 (PARA PROPÓSITO ESPECÍFICO):**

[Versión optimizada para un uso caso específico]

---

**RECOMENDACIONES FINALES:**

1. PRINCIPIO CLAVE: [Principio de prompt engineering aplicado]
2. ERRORES A EVITAR: [Errores comunes en este tipo de prompt]
3. PRÓXIMOS PASOS: [Cómo probar y iterar el prompt]
4. RECURSOS: [Herramientas o templates recomendados]

---

**INSTRUCCIONES PARA TI (EL MODELO DE IA):**
Analiza el prompt original en profundidad y genera las 3 versiones optimizadas siguiendo exactamente la estructura anterior. Sé específico en las mejoras aplicadas y explica el razonamiento detrás de cada cambio.`}const ve=(e,t,a)=>!t||!t.apply?re(e):t.apply(e,a),oe=()=>Object.values(C).map(e=>({name:e.name,description:e.description,icon:e.icon,color:e.color})),se=(e,t,a)=>({CHAIN_OF_THOUGHT:`Seleccionada porque el prompt es de tipo "${D(e).type}" y requiere razonamiento analítico paso a paso. La claridad (${a.clarity}/100) sugiere que beneficiará de estructura sistemática.`,FEW_SHOT:`Seleccionada porque el prompt se beneficiará de ejemplos concretos. La especificidad (${a.specificity}/100) indica que ejemplos ayudarán a definir mejor el resultado esperado.`,ROLE_PLAY:`Seleccionada para dar contexto profesional. El análisis muestra contexto (${a.context}/100), por lo que definir un rol mejorará la relevancia de la respuesta.`,STRUCTURED_OUTPUT:`Seleccionada porque el prompt necesita formato claro. La estructura actual (${a.structure}/100) puede mejorarse con plantillas definidas.`,META_PROMPTING:"Seleccionada para enseñar prompt engineering. El prompt es sobre prompts o se beneficiará de análisis comparativo."})[t.name.toUpperCase().replace(/ /g,"_")]||"Seleccionada basándose en el análisis de calidad del prompt.",$={clarity:['Usa verbos de acción específicos: "analiza", "crea", "compara", "evalúa"',"Formula preguntas directas en lugar de declaraciones vagas","Especifica exactamente qué información necesitas",'Evita lenguaje ambiguo como "algo sobre" o "cosas relacionadas con"'],specificity:['Incluye números y cantidades: "3 ejemplos", "500 palabras", "5 pasos"','Define el formato de salida: "lista", "tabla", "párrafos", "diagrama"','Establece límites claros: "máximo 300 palabras", "al menos 2 fuentes"','Menciona criterios de éxito: "debe incluir estadísticas", "necesito casos reales"'],context:['Especifica un rol: "Como experto en...", "Actúa como..."','Define la audiencia: "Para estudiantes universitarios", "Para ejecutivos"','Proporciona antecedentes: "En el contexto de...", "Considerando que..."','Menciona restricciones: "Sin usar tecnicismos", "Para principiantes"'],structure:["Usa numeración o viñetas para pasos secuenciales",'Divide en secciones claras: "Introducción", "Desarrollo", "Conclusión"','Emplea conectores: "Primero", "Luego", "Además", "Finalmente"',"Organiza la información de más a menos importante"]},K={analytical:{original:"Haz un análisis",optimized:`Como analista de datos con 5 años de experiencia, analiza las tendencias de ventas del último trimestre. Proporciona:
1. Crecimiento por producto
2. Comparación con el trimestre anterior
3. 3 recomendaciones accionables
Formato: Reporte ejecutivo de 300 palabras`,improvements:["Especificó rol profesional","Definió métricas concretas","Estableció formato y longitud"]},creative:{original:"Escribe algo creativo",optimized:`Actúa como un escritor de ciencia ficción premiado. Escribe un relato corto (500 palabras) sobre una IA que descubre emociones. Incluye:
• Un conflicto moral
• Un giro inesperado
• Diálogo natural
Tono: Suspenso filosófico`,improvements:["Definió género y estilo","Especificó elementos narrativos","Estableció tono y longitud"]},instructional:{original:"Explica cómo hacerlo",optimized:`Como instructor de programación para principiantes, explica paso a paso cómo crear una función en Python que calcule el promedio de una lista. Incluye:
1. Sintaxis básica
2. Ejemplo con código
3. Error común a evitar
4. Ejercicio práctico
Nivel: Principiante absoluto`,improvements:["Especificó audiencia y nivel","Estructuró en pasos claros","Incluyó ejemplos y ejercicios"]}},Ee=(e,t,a,o)=>{const s=te(o.score),i=se(e,a,o),n=[];o.clarity<60&&n.push(...$.clarity.slice(0,2)),o.specificity<50&&n.push(...$.specificity.slice(0,2)),o.context<40&&n.push(...$.context.slice(0,2)),o.structure<30&&n.push(...$.structure.slice(0,2)),n.length===0&&n.push("¡Buen trabajo! Tu prompt ya tiene buena calidad base.","Considera experimentar con diferentes técnicas para ver qué funciona mejor","Prueba el prompt optimizado y compara resultados con el original");let h=null;return o.clarity<50?h=K.analytical:o.specificity<40?h=K.instructional:o.context<30&&(h=K.creative),{qualityAssessment:{level:s.level,score:o.score,color:s.color,emoji:s.emoji,breakdown:{clarity:o.clarity,specificity:o.specificity,context:o.context,structure:o.structure}},techniqueApplied:{name:a.name,description:a.description,explanation:i,icon:a.icon,color:a.color},improvementsMade:ye(e,t,o),educationalTips:[...new Set(n)].slice(0,5),similarExample:h,nextSteps:["Prueba este prompt optimizado en ChatGPT o Claude","Compara los resultados con tu prompt original","Itera basándote en lo que aprendiste","Experimenta con otras técnicas para el mismo prompt","Guarda este prompt en tu biblioteca personal"],learningResources:["Template MasterPrompt: /public/ialab-resources/templates/module1/masterprompt-template.md","Módulo 1 - Lección 3: Técnicas de Prompt Engineering","Infográfico: Chain-of-Thought vs Few-Shot Learning","Ejercicio práctico: Optimiza 5 prompts diferentes"]}};function ye(e,t,a){const o=[],s=e.split(/\s+/).length;return t.split(/\s+/).length>s*1.5&&o.push("Añadido contexto y especificidad adicional"),!e.includes(`
`)&&t.includes(`
`)&&o.push("Mejorada estructura con formato claro"),!e.match(/(como|actúa como|eres)/i)&&t.match(/(como|actúa como|eres)/i)&&o.push("Añadida especificación de rol profesional"),!e.match(/(palabras|caracteres|ejemplos|pasos)/i)&&t.match(/(palabras|caracteres|ejemplos|pasos)/i)&&o.push("Definidos parámetros y límites claros"),a.clarity<60&&t.includes("?")&&o.push("Convertido a pregunta clara y directa"),a.specificity<50&&t.match(/\d+/g)?.length>(e.match(/\d+/g)?.length||0)&&o.push("Añadidas cantidades y medidas específicas"),a.context<40&&t.match(/(contexto|para|considerando)/i)&&o.push("Proporcionado contexto adicional"),a.structure<30&&t.match(/(\d+\.|- |\* )/g)?.length>0&&o.push("Estructurado en pasos o secciones claras"),o.length===0&&o.push("Optimizado para mejor comprensión por modelos de IA","Ajustado tono y formato para mayor efectividad","Estructurado para generar respuestas más completas"),o.slice(0,5)}const Se=(e,t)=>{const a=i=>{const n=i.split(/\s+/).length,h=i.split(/[.!?]+/).length-1,f=i.split(/\n\s*\n/).length,u=(i.match(/\?/g)||[]).length,g=(i.match(/\b\d+\b/g)||[]).length,v=(i.match(/(\d+\.|- |\* |•)/g)||[]).length;return{words:n,sentences:h,paragraphs:f,questions:u,numbers:g,structureMarkers:v,clarityScore:Ae(i),specificityScore:Ce(i)}},o=a(e),s=a(t);return{original:o,optimized:s,improvements:{clarity:s.clarityScore-o.clarityScore,specificity:s.specificityScore-o.specificityScore,structure:s.structureMarkers-o.structureMarkers,detail:s.words-o.words}}};function Ae(e){let t=50;return e.includes("?")&&(t+=20),e.match(/^(como|qué|por qué|cómo|cuál)/i)&&(t+=15),e.match(/(explica|describe|analiza|crea|compara)/i)&&(t+=25),e.length>100&&e.length<500&&(t+=10),e.split(/\s+/).length<10&&(t-=30),Math.max(0,Math.min(100,t))}function Ce(e){let t=50;const a=(e.match(/\b\d+\b/g)||[]).length;return t+=a*5,e.match(/(palabras|caracteres|párrafos|ejemplos)/i)&&(t+=20),e.match(/(máximo|mínimo|al menos)/i)&&(t+=15),e.match(/(formato|estructura|organiza)/i)&&(t+=10),Math.max(0,Math.min(100,t))}const je=e=>{const{qualityAssessment:t,techniqueApplied:a,improvementsMade:o}=e;return`## 📊 RESUMEN DE OPTIMIZACIÓN
  
**CALIDAD:** ${t.emoji} ${t.level} (${t.score}/100)

**TÉCNICA APLICADA:** ${a.icon} ${a.name}
${a.explanation}

**MEJORAS PRINCIPALES:**
${o.map((s,i)=>`${i+1}. ${s}`).join(`
`)}

**IMPACTO ESPERADO:** Este prompt optimizado debería generar respuestas más precisas, estructuradas y relevantes que el original.

**PRÓXIMO PASO:** Prueba ambas versiones y compara los resultados.`},Q=3,J=500,Ie="deepseek-flash",Ne=.7,Te=1e3,Pe="/api/chat",Oe=10,ee={score:95,clarity:9,specificity:9,context:9,structure:9},Re={score:40,clarity:3,specificity:2,context:2,structure:1},we=2e3,Le=120,De="deepseek-flash",Me="v2.0",_e={name:"DeepSeek Prompt Engineering",description:"Generado con IA avanzada especializada en ingeniería de prompts",icon:"fa-brain",color:"#06B6D4",explanation:"Prompt generado automáticamente por DeepSeek AI analizando la estructura óptima para tu idea"},ke="DeepSeek AI",$e={totalOptimizations:0,lastOptimization:null,favoriteTechnique:"Ninguna",averageScore:0,improvementTrend:0},Ue=e=>`Eres un profesor experto en Prompt Engineering. El estudiante ingresó esta idea básica: '${e}'. Convierte esta idea en un Prompt Maestro estructurado. Devuelve ÚNICAMENTE un objeto JSON válido con estas claves exactas (sin markdown, solo el JSON):
                                    
                                    rol: El rol para la IA.
                                    tarea: La acción específica.
                                    formato: El formato de salida.
                                    prompt_maestro: El prompt final optimizado.
                                    analisis_tecnico: Un feedback directo al estudiante, explicándole de forma educativa por qué su idea era incompleta y cómo los elementos agregados mejoran el resultado.`;function qe(e,t,a){const o=t.find(i=>i.id===e),s=a.length;return{module:o?.title||"Módulo general",topics:o?.topics||["Ingeniería de prompts","Comunicación con IA"],userLevel:s<3?"Principiante":s<6?"Intermedio":"Avanzado",challenge:o?.challenge||"Crear prompts efectivos",techniques:oe().map(i=>i.name)}}function ze(e,t){const a=t();if(e.trim().length>0){W(e);const o=D(e),s=Y(e);return[`Optimiza este prompt aplicando ${o.technique}`,`Mejora la claridad de: "${e.substring(0,40)}..."`,`Añade más contexto sobre ${s[0]||"el tema"}`,`Estructura mejor este prompt para ${o.type.toLowerCase()}`]}return[`Como ${a.userLevel.toLowerCase()}, crea un prompt para ${a.challenge.toLowerCase()}`,`Genera un prompt que use ${a.techniques[0]} para resolver un problema real`,'Optimiza este prompt básico: "Explica cómo funciona..."',`Crea un prompt educativo sobre ${a.topics[0]?.toLowerCase()||"IA"}`]}function Fe(e){if(e.length===0)return $e;const t={};e.forEach(i=>{if(i&&i.techniqueApplied&&i.techniqueApplied.name){const n=i.techniqueApplied.name;t[n]=(t[n]||0)+1}});const a=Object.entries(t).sort((i,n)=>n[1]-i[1])[0]?.[0]||"Ninguna",o=Math.round(e.reduce((i,n)=>n&&n.analysis&&n.analysis.score?i+n.analysis.score:i,0)/(e.length||1));let s=0;if(e.length>=3){const i=e.slice(-3).map(u=>u&&u.analysis?u.analysis.score:0),n=e.slice(0,3).map(u=>u&&u.analysis?u.analysis.score:0),h=i.reduce((u,g)=>u+g,0)/i.length,f=n.reduce((u,g)=>u+g,0)/n.length;s=Math.round(f-h)}return{totalOptimizations:e.length,lastOptimization:e[0]?.timestamp||null,favoriteTechnique:a,averageScore:o,improvementTrend:s,averageLength:Math.round(e.reduce((i,n)=>n&&n.originalPrompt?i+n.originalPrompt.length:i,0)/(e.length||1))}}function He(){return oe()}function Ge(e){if(!e||e.trim().length<3)return null;try{const t=W(e),a=D(e),o=te(t.score);return{score:t.score,level:o.level,color:o.color,emoji:o.emoji,type:a.type,technique:a.technique,icon:a.icon,wordCount:e.split(/\s+/).length,suggestions:t.suggestions.slice(0,2),analysis:t.analysis}}catch{return null}}function Ve(e){return e.trim().length>=Q&&e.trim().length<=J}function Be(e){if(!e)return!1;try{return navigator.clipboard.writeText(e),!0}catch{const a=document.createElement("textarea");a.value=e,document.body.appendChild(a),a.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(a)}}}async function ae(e,t){const a=await fetch(`${ce}${Pe}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:Ie,messages:[{role:"system",content:Ue(e)}],temperature:Ne,max_tokens:Te,isJson:!0}),signal:t});if(!a.ok){const s=await a.text();throw new Error(`API Error ${a.status}: ${s}`)}const o=await a.json();if(!o.result)throw new Error("Respuesta de API inválida");return JSON.parse(o.result)}const Ke=()=>{const{activeMod:e=1,modules:t=[],completedModules:a=[]}=le()??{},[o,s]=l.useState(""),[i,n]=l.useState(!1),[h,f]=l.useState(""),[u,g]=l.useState(null),[v,A]=l.useState(null),[d,P]=l.useState([]),[O,w]=l.useState(null),[M,I]=l.useState(!1),[N,T]=l.useState(null),x=l.useRef(null);l.useEffect(()=>()=>{x.current&&x.current.abort()},[]);const R=l.useCallback(()=>qe(e,t,a),[e,t,a]),U=l.useCallback(async p=>{if(!p.trim())return A("Por favor, ingresa una idea para convertir en prompt"),null;if(p.trim().length<Q)return A("La idea debe tener al menos 3 caracteres"),null;if(p.trim().length>J)return A("La idea no debe exceder 500 caracteres"),null;n(!0),f("Generando prompt maestro con DeepSeek..."),A(null),T(null);try{x.current&&x.current.abort();const S=new AbortController;x.current=S;const c=await(async()=>{I(!0),f("Conectando con DeepSeek API...");try{const m=await ae(p,S.signal);return w(m),m}catch(m){return T(`Error con DeepSeek API: ${m.message}. Usando sistema local...`),null}finally{I(!1)}})();let b;if(c)b={originalPrompt:p,timestamp:new Date().toISOString(),analysis:{...ee,commonProblems:["Idea demasiado básica","Falta de estructura"],suggestions:["Agregar rol específico","Definir formato de salida","Especificar tarea concreta"],wordCount:c.prompt_maestro.split(" ").length,charCount:c.prompt_maestro.length},optimizedPrompt:c.prompt_maestro,techniqueApplied:_e,feedback:{summary:c.analisis_tecnico,improvements:[`Rol definido: ${c.rol}`,`Tarea específica: ${c.tarea}`,`Formato estructurado: ${c.formato}`],educationalInsights:"",beforeAfterComparison:{before:Re,after:ee,improvement:137.5},executiveSummary:`Transformación de idea básica "${p}" en prompt profesional con estructura RTF (Rol, Tarea, Formato)`},metadata:{processingTime:we,techniqueUsed:ke,modelVersion:De,source:"DeepSeek API"},deepSeekData:c};else{f("Usando sistema local de análisis...");const m=W(p),y=he(p,m),L=ve(p,y,m),k=Ee(p,L,y,m),ne=Se(p,L),ie=je(k);b={originalPrompt:p,timestamp:new Date().toISOString(),analysis:{score:m.score,clarity:m.clarity,specificity:m.specificity,context:m.context,structure:m.structure,commonProblems:m.commonProblems,suggestions:m.suggestions,wordCount:m.wordCount,charCount:m.charCount},optimizedPrompt:L,techniqueApplied:{name:y.name,description:y.description,icon:y.icon,color:y.color,explanation:se(p,y,m)},feedback:{summary:k.summary,improvements:k.improvements,educationalInsights:k.educationalInsights,beforeAfterComparison:ne,executiveSummary:ie},metadata:{processingTime:Le,techniqueUsed:y.name,modelVersion:Me,source:"Sistema local"}}}return g(b),P(m=>[b,...m.slice(0,Oe-1)]),b}catch(S){return S.name==="AbortError"||A(`Error al procesar la idea: ${S.message}`),null}finally{n(!1),f("")}},[]),_=l.useCallback(()=>{P([]),g(null),s("")},[]),q=l.useCallback(p=>{d[p]&&(s(d[p].originalPrompt||""),g(d[p]))},[d]),z=l.useCallback(()=>Fe(d),[d]),F=l.useCallback(()=>ze(o,R),[R,o]),H=l.useCallback(p=>Be(p),[]),G=l.useCallback(p=>Ve(p),[]),V=l.useCallback(()=>He(),[]),B=l.useCallback(p=>Ge(p),[]);return{input:o,setInput:s,loading:i,loadMsg:h,genData:u,error:v,history:d,optimizePrompt:U,copyToClipboard:H,clearHistory:_,loadFromHistory:q,getUsageStats:z,getDynamicContext:R,getSuggestions:F,getTechniquesForDisplay:V,getQuickAnalysis:B,isValidInput:G,MAX_INPUT_LENGTH:J,MIN_INPUT_LENGTH:Q,generateWithDeepSeek:async p=>{x.current&&x.current.abort();const S=new AbortController;x.current=S,I(!0),T(null),f("Conectando con DeepSeek API...");try{const c=await ae(p,S.signal);return w(c),c}catch(c){return c.name==="AbortError"||T(`Error con DeepSeek API: ${c.message}. Verifica que el servidor backend esté ejecutándose.`),null}finally{I(!1),f("")}},deepSeekResult:O,isGenerating:M,apiError:N,setDeepSeekResult:w}},oa=({className:e="",...t})=>{const{t:a}=pe(),{input:o,setInput:s,loading:i,genData:n,error:h,optimizePrompt:f,isValidInput:u,apiError:g,getQuickAnalysis:v,copyToClipboard:A}=Ke(),[d,P]=l.useState(null),[O,w]=l.useState(o.length),[M,I]=l.useState(!1),[N,T]=l.useState(!0),[x,R]=l.useState(!1),U=l.useCallback(c=>{const b=c.target.value;if(s(b),b.trim().length>=3){const m=v(b);P(m)}else P(null)},[s,v]);l.useEffect(()=>{w(o.length)},[o]),l.useEffect(()=>{if(o.trim().length>=3){const c=v(o);P(c)}},[o,v]),l.useEffect(()=>{n?.optimizedPrompt&&T(!0)},[n]);const _=async()=>{if(!u(o)){alert(a("ialab.synthesizer.validation_error",{length:o.length}));return}await f(o)},q=c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),_())},z=()=>{n?.optimizedPrompt&&(A(n.optimizedPrompt),I(!0),setTimeout(()=>I(!1),2e3))},F=c=>!d||!d.analysis?0:Math.round(d.analysis[c]||0),H=c=>c>=70?"text-[var(--theme-emphasis)]":c>=40?"text-[var(--theme-primary)]":"text-slate-600",G=c=>c>=70?"bg-[var(--theme-emphasis)]":c>=40?"bg-[var(--theme-primary)]":"bg-slate-300",V=c=>c>=70?"fa-check-circle":c>=40?"fa-bolt":"fa-circle",B=[{name:a("ialab.synthesizer.clarity_label"),key:"clarity"},{name:a("ialab.synthesizer.context_label"),key:"context"},{name:a("ialab.synthesizer.metric_precision"),key:"specificity"},{name:a("ialab.synthesizer.structure_label"),key:"structure"}],p=n?.feedback?.improvements||[],S=i;return r.jsxs(X.div,{whileHover:{scale:1.04},transition:{duration:.2},animate:S?{opacity:[1,.85,1]}:{},className:j("relative z-10 bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-slate-200/60 overflow-hidden","space-y-6",e),...t,children:[r.jsx("div",{className:"absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--theme-emphasis)] via-[var(--theme-emphasis)]-dark to-[var(--theme-primary)] rounded-t-2xl"}),r.jsxs("div",{role:"button",tabIndex:0,"aria-expanded":x,onClick:()=>R(!x),onKeyDown:c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),R(!x))},className:"flex items-center justify-between cursor-pointer group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/40",children:[r.jsxs("div",{className:"flex-1",children:[r.jsx("h2",{className:"text-lg md:text-xl font-bold text-[var(--theme-emphasis)] group-hover:text-[var(--theme-primary)] transition-colors duration-300",children:a("ialab.reactive_prompt.title")}),r.jsx("p",{className:"text-slate-600 text-sm md:text-base leading-relaxed mt-1",children:a("ialab.reactive_prompt.subtitle")}),!x&&r.jsx("div",{className:"mt-4",children:r.jsxs("div",{className:"inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl shadow-sm hover:from-[var(--theme-emphasis)]-dark hover:to-[var(--theme-primary)]-dark hover:shadow group-hover:scale-105 transition-all duration-300 cursor-pointer",children:[r.jsx(E,{name:"fa-hand-pointer",className:"w-4 h-4 text-white"}),r.jsx("span",{className:"text-sm font-bold text-white tracking-wide",children:a("ialab.reactive_prompt.open_tools")}),r.jsx(E,{name:"fa-chevron-right",className:"w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300"})]})})]}),r.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${x?"bg-[var(--theme-emphasis)]/10 rotate-180":"bg-[var(--theme-primary)]/15 group-hover:scale-110"}`,children:r.jsx(E,{name:x?"fa-chevron-up":"fa-chevron-down",className:`w-3.5 h-3.5 transition-all duration-300 ${x?"text-[var(--theme-emphasis)]":"text-[var(--theme-primary)] group-hover:text-[var(--theme-emphasis)]"}`})})]}),x&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"flex flex-col md:flex-row gap-5 md:gap-8",children:[r.jsxs("div",{className:"flex-1 flex flex-col",children:[r.jsxs("div",{className:"flex-1",children:[r.jsxs("div",{className:"relative",children:[r.jsx("div",{className:"absolute top-3 left-3 text-[var(--theme-emphasis)]/30 pointer-events-none z-10",children:r.jsx(E,{name:"fa-pen",className:"w-4 h-4"})}),r.jsx("textarea",{value:o,onChange:U,onKeyDown:q,placeholder:a("ialab.reactive_prompt.input_placeholder"),className:j("w-full h-32 md:h-40","bg-slate-50/50 border border-slate-200 rounded-xl","pl-10 pr-4 py-3","text-slate-700 placeholder:text-slate-600/50 text-sm","resize-none","focus:outline-none focus:ring-2 focus:ring-[var(--theme-emphasis)]/20 focus:border-[var(--theme-emphasis)]/30 focus:bg-white","transition-all duration-300","shadow-sm"),maxLength:500})]}),r.jsxs("div",{className:"mt-2 flex justify-between items-center",children:[r.jsx("span",{className:j("text-xs",O>450?"text-amber-500":"text-slate-500"),children:a("ialab.reactive_prompt.chars",{count:O})}),O>0&&O<3&&r.jsx("span",{className:"text-xs text-amber-500",children:a("ialab.reactive_prompt.min_chars")})]})]}),r.jsxs("div",{className:"mt-6",children:[r.jsx(X.button,{onClick:_,disabled:i||!u(o),whileHover:{scale:1.03},whileTap:{scale:.97},transition:{type:"spring",stiffness:400,damping:17},className:j("w-full px-6 py-3 rounded-xl","bg-gradient-to-r from-[var(--theme-emphasis)] via-[var(--theme-emphasis)]-dark to-[var(--theme-primary)]","text-white font-semibold","hover:bg-white hover:text-[var(--theme-emphasis)]","shadow-md shadow-[var(--theme-emphasis)]/20 hover:shadow-lg hover:shadow-[var(--theme-emphasis)]/30","transition-all duration-300","flex items-center justify-center gap-2","focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30 focus:ring-offset-2","disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white"),"aria-label":a(i?"ialab.reactive_prompt.generating":"ialab.reactive_prompt.generate"),children:i?r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"}),r.jsx("span",{children:a("ialab.reactive_prompt.generating")})]}):r.jsxs(r.Fragment,{children:[r.jsx(E,{name:"fa-wand-magic-sparkles",className:"text-sm text-white hover:text-[var(--theme-emphasis)]"}),r.jsx("span",{className:"text-sm text-white hover:text-[var(--theme-emphasis)]",children:a("ialab.reactive_prompt.generate")})]})}),h&&r.jsx("div",{className:"mt-3 p-3 bg-red-50 border border-red-200 rounded-lg",children:r.jsx("p",{className:"text-sm text-red-600",children:h})}),g&&r.jsx("div",{className:"mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg",children:r.jsx("p",{className:"text-sm text-amber-600",children:g})})]})]}),r.jsx("div",{className:"flex-1",children:r.jsxs("div",{className:"h-full flex flex-col justify-center",children:[r.jsx("div",{className:"mb-4",children:r.jsx("h3",{className:"text-xs font-semibold text-slate-600 uppercase tracking-wider",children:a("ialab.reactive_prompt.live_analysis")})}),r.jsx("div",{className:"space-y-3",children:B.map(c=>{const b=F(c.key),m=H(b),y=V(b),L=G(b);return r.jsxs("div",{className:"flex items-center justify-between p-3 rounded-lg bg-[var(--theme-emphasis)]/5 border border-[var(--theme-emphasis)]/10 hover:bg-[var(--theme-emphasis)]/8 transition-all duration-300",children:[r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx(E,{name:y,className:j("text-sm",m)}),r.jsx("span",{className:"text-xs font-medium text-slate-700",children:c.name})]}),r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx("div",{className:"w-20 md:w-24 h-2.5 bg-slate-200/60 rounded-full overflow-hidden",children:r.jsx("div",{className:j("h-full rounded-full transition-all duration-500",L),style:{width:`${b}%`}})}),r.jsxs("span",{className:j("text-xs font-semibold w-8 text-right",m),children:[b,"%"]})]})]},c.name)})}),r.jsx("div",{className:"mt-4 pt-3 border-t border-[var(--theme-emphasis)]/10",children:o.trim()?o.trim().length<3?r.jsx("p",{className:"text-xs text-amber-500 text-center",children:a("ialab.reactive_prompt.min_chars")}):d?r.jsxs("div",{className:"flex flex-col items-center",children:[r.jsxs("div",{className:"flex items-center gap-1",children:[r.jsx("span",{className:j("text-xs font-semibold px-2.5 py-1 rounded-md",d.level==="Excelente"?"bg-emerald-50 text-emerald-700":d.level==="Bueno"?"bg-[var(--theme-emphasis)]/10 text-[var(--theme-emphasis)]":d.level==="Aceptable"?"bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]":"bg-slate-100 text-slate-500"),children:d.level}),d.emoji&&r.jsx("span",{className:"text-xs ml-1",children:d.emoji})]}),d.score>0&&r.jsx("span",{className:"text-xs text-slate-500 mt-1",children:a("ialab.reactive_prompt.score",{score:d.score})})]}):r.jsx("p",{className:"text-xs text-slate-600 text-center",children:a("ialab.reactive_prompt.analyzing")}):r.jsx("p",{className:"text-xs text-slate-600 text-center",children:a("ialab.reactive_prompt.write_to_analyze")})})]})})]}),n&&n.optimizedPrompt&&r.jsxs("div",{className:"space-y-4 pt-4 border-t border-[var(--theme-emphasis)]/10",children:[r.jsxs("div",{onClick:()=>T(!N),className:"flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--theme-emphasis)]/5 hover:bg-[var(--theme-emphasis)]/10 border border-[var(--theme-primary)]/20 cursor-pointer transition-colors duration-200",children:[r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx(E,{name:"fa-terminal",className:"text-[var(--theme-emphasis)] w-4 h-4"}),r.jsx("span",{className:"text-xs font-bold tracking-[0.12em] uppercase text-[var(--theme-emphasis)]",children:a("ialab.reactive_prompt.result")}),r.jsx("div",{className:`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${N?"bg-[var(--theme-emphasis)]/10":"bg-[var(--theme-primary)]/15"}`,children:r.jsx(E,{name:N?"fa-chevron-up":"fa-chevron-down",className:`w-3 h-3 ${N?"text-[var(--theme-emphasis)]":"text-[var(--theme-primary)]"}`})})]}),r.jsxs("button",{onClick:c=>{c.stopPropagation(),z()},className:"flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[var(--theme-emphasis)] text-xs font-semibold rounded-lg transition-all duration-200",children:[r.jsx(E,{name:M?"fa-check":"fa-copy",className:"w-3 h-3"}),r.jsx("span",{children:a(M?"ialab.reactive_prompt.copied":"ialab.reactive_prompt.copy")})]})]}),N&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"relative bg-white rounded-xl p-5 md:p-6 border border-slate-200/60 shadow-sm",children:[r.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[r.jsx("div",{className:"w-6 h-6 rounded-md bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] flex items-center justify-center",children:r.jsx(E,{name:"fa-terminal",className:"text-white w-3.5 h-3.5"})}),r.jsx("span",{className:"text-xs font-bold tracking-[0.12em] uppercase text-[var(--theme-emphasis)]",children:a("ialab.reactive_prompt.generated_prompt")})]}),r.jsx("div",{className:"overflow-x-auto",children:r.jsx("p",{className:"text-slate-700 text-sm leading-relaxed font-mono whitespace-pre-wrap",children:n.optimizedPrompt})})]}),r.jsxs("div",{className:"bg-[var(--theme-emphasis)]/5 border-l-4 border-[var(--theme-emphasis)] rounded-r-xl p-4 md:p-5",children:[r.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[r.jsx("div",{className:"w-7 h-7 rounded-md bg-[var(--theme-emphasis)]/10 flex items-center justify-center flex-shrink-0",children:r.jsx(E,{name:"fa-lightbulb",className:"text-[var(--theme-emphasis)] w-3.5 h-3.5"})}),r.jsx("span",{className:"font-semibold text-[var(--theme-emphasis)] text-sm",children:a("ialab.reactive_prompt.educational_feedback")})]}),r.jsx("p",{className:"text-slate-600 text-sm md:text-base leading-relaxed",children:n.feedback?.educationalInsights||n.feedback?.summary||""}),p.length>0&&r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"my-3 border-t border-[var(--theme-emphasis)]/10"}),r.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[r.jsx("div",{className:"w-5 h-5 rounded-md bg-[var(--theme-emphasis)]/10 flex items-center justify-center flex-shrink-0",children:r.jsx(E,{name:"fa-list-check",className:"text-[var(--theme-emphasis)] w-2.5 h-2.5"})}),r.jsx("span",{className:"text-xs font-semibold text-[var(--theme-emphasis)] uppercase tracking-wider",children:a("ialab.reactive_prompt.improvements")})]}),r.jsx("ul",{className:"space-y-2",children:p.map((c,b)=>r.jsxs("li",{className:"flex items-start gap-2.5 text-sm text-slate-600",children:[r.jsx("div",{className:"w-5 h-5 rounded-full bg-[var(--theme-emphasis)]/10 flex items-center justify-center flex-shrink-0 mt-0.5",children:r.jsx(E,{name:"fa-check",className:"text-[var(--theme-emphasis)] w-2.5 h-2.5"})}),r.jsx("span",{className:"leading-snug",children:c})]},b))})]})]})]})]})]})]})};export{oa as default};
