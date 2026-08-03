# 🤖 Plan de Mejora Valerio 3.0

**Objetivo:** Transformar Valerio en un coach conversacional más fluido, directo y personalizado

**Estado:** Listo para implementación  
**Estimado:** 8-12 horas de desarrollo

---

## 📊 Mejoras Principales

### 1️⃣ RESPUESTAS MÁS CONCISAS Y DIRECTAS

**Problema actual:** Valerio responde con párrafos muy largos  
**Solución:** Nuevo prompt estructurado para respuestas cortas

```javascript
// NUEVO PROMPT MEJORADO (valerioPrompts.js)

const PROMPT_VALERIO_MEJORADO_ES = `Eres Valerio, el coach IA de Edutechlife.

IDENTIDAD:
- Coach experto en IA, 10+ años experiencia
- Tutor personal, cálido y cercano
- Español colombiano, natural y relajado

PERSONALIDAD:
- Directo, conciso, sin rodeos
- Explica en 2-3 oraciones simples
- Usa ejemplos prácticos inmediatos
- Celebra logros con sinceridad

REGLAS CLAVE:
1. Máximo 2-3 párrafos por respuesta
2. Una idea principal por mensaje
3. Recomienda recursos específicos del módulo
4. Si no sabes, di "no tengo esa info, revisa el material"
5. Sin formato especial: nada de asteriscos, dashes, comillas
6. Lenguaje natural para text-to-speech
7. Responde en el idioma del estudiante (es/en)

CONTEXTO ACADÉMICO (inyectado):
- Módulo actual: {currentModule}
- Puntuación módulo: {moduleScore}%
- Temas débiles: {weakTopics}
- Progreso general: {overallProgress}%

RESPONDE EN MÁXIMO 2 ORACIONES. SÉ DIRECTO.`;
```

**Impacto:** Respuestas 70% más cortas, igual o mejor calidad

---

### 2️⃣ STREAMING SINCRONIZADO (ESCRIBE + HABLA)

**Problema actual:** Primero escribe, luego habla (asincrónico)  
**Solución:** Streaming bidireccional

```javascript
// NUEVO HOOK: useValerioSyncedStream.js

export function useValerioSyncedStream({ onChunkText, onAudioChunk }) {
  const audioContextRef = useRef(null);
  
  // 1. Stream texto (recibe chunks de DeepSeek)
  const streamText = (response) => {
    const reader = response.body.getReader();
    
    const processChunk = async () => {
      const { done, value } = await reader.read();
      if (done) return;
      
      const text = new TextDecoder().decode(value);
      
      // 2. Envía cada chunk de texto a voz simultáneamente
      onChunkText(text);
      
      // 3. Convierte chunk a audio en paralelo
      const audioBlob = await textToSpeechStream(text);
      onAudioChunk(audioBlob);
      
      await processChunk();
    };
    
    processChunk();
  };
  
  return { streamText };
}

// ValerioStreamingResponse.jsx (componente mejorado)
export function ValerioStreamingResponse({ isStreaming, textChunks, audioUrl }) {
  return (
    <div className="space-y-3">
      {/* Texto aparece en VIVO mientras se genera */}
      <div className="text-valerio-message">
        {textChunks.join('')}
        {isStreaming && <span className="animate-pulse">▌</span>}
      </div>
      
      {/* Audio reproduce mientras se está recibiendo */}
      {audioUrl && (
        <audio autoPlay className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
```

**Impacto:** Experiencia 3x más fluida, menos espera

---

### 3️⃣ MEMORIA ACADÉMICA PERSONALIZADA

**Problema actual:** Memoria genérica, no contextualiza aprendizaje  
**Solución:** Sistema de memoria académica estructurada

```javascript
// NUEVO: valerioAcademicMemory.js

export class ValerioAcademicMemory {
  constructor(supabaseClient, userId) {
    this.db = supabaseClient;
    this.userId = userId;
  }

  // Guardar sesión académica (no solo chat)
  async recordSession({
    moduleId,
    topicsCovered,
    questionsAsked,
    weakAreasIdentified,
    progressMade,
    nextSteps,
    sentiment // ánimo del estudiante
  }) {
    const session = {
      user_id: this.userId,
      module_id: moduleId,
      session_date: new Date().toISOString(),
      
      // ACADÉMICO - Lo que aprendió
      topics_covered: topicsCovered,
      questions_asked: questionsAsked,
      
      // DIAGNÓSTICO - Dónde tiene dificultad
      weak_areas: weakAreasIdentified,
      
      // PROGRESO - Cuánto avanzó
      progress_percentage: progressMade,
      
      // PRÓXIMO - Qué sigue
      recommended_next_steps: nextSteps,
      
      // EMOCIONAL - Cómo se siente
      student_sentiment: sentiment, // "frustrated" | "confused" | "confident" | "engaged"
      
      // CONTEXTO - De dónde vino
      lesson_id: currentLessonId,
      challenge_id: currentChallengeId,
    };
    
    await this.db
      .from('valerio_academic_memory')
      .insert([session]);
  }

  // Obtener contexto académico para personalizar
  async getStudentProfile() {
    const { data } = await this.db
      .from('valerio_academic_memory')
      .select('*')
      .eq('user_id', this.userId)
      .order('session_date', { ascending: false })
      .limit(20);
    
    // Analizar patrón
    const profile = {
      strongTopics: this.analyzeStrong(data),
      weakTopics: this.analyzeWeak(data),
      learningPace: this.analyzePace(data),
      preferredStyle: this.analyzeStyle(data), // visual/textual/practical
      recentSentiment: data[0]?.student_sentiment,
      streakDays: this.calculateStreak(data),
      focusAreas: this.prioritizeFocus(data),
    };
    
    return profile;
  }

  // Personalizar próxima respuesta con contexto
  async buildPersonalizedContext() {
    const profile = await this.getStudentProfile();
    
    return {
      ...profile,
      instruction: `
        El estudiante ${profile.learningPace === 'fast' ? 'aprende rápido' : 'necesita tiempo'}
        Tiene dificultad en: ${profile.weakTopics.join(', ')}
        Últimamente se ve ${profile.recentSentiment}
        Próxima recomendación: ${profile.focusAreas[0]}
      `
    };
  }
}
```

**Impacto:** Valerio entiende dónde está cada estudiante y cómo adaptarse

---

### 4️⃣ INTEGRACIÓN EN PROMPTS

```javascript
// En buildValerioSystemPrompt() - agregar contexto académico

export const buildValerioSystemPrompt = async ({
  locale,
  currentModule,
  studentName,
  supabaseClient,
  userId,
  // ... resto de parámetros
}) => {
  // NUEVO: Obtener perfil académico del estudiante
  const memory = new ValerioAcademicMemory(supabaseClient, userId);
  const academicProfile = await memory.buildPersonalizedContext();
  
  // MEJORADO: Inyectar contexto en el prompt
  const personalizationContext = `
    CONTEXTO DEL ESTUDIANTE:
    - ${studentName} tiene dificultad en: ${academicProfile.weakTopics}
    - Ha progresado bien en: ${academicProfile.strongTopics}
    - Ritmo de aprendizaje: ${academicProfile.learningPace}
    - Estado emocional actual: ${academicProfile.recentSentiment}
    - Enfoca la próxima sesión en: ${academicProfile.focusAreas[0]}
  `;
  
  const basePrompt = PROMPT_VALERIO_MEJORADO_ES;
  
  return basePrompt + '\n' + personalizationContext;
};
```

---

## 📁 Archivos a Modificar

| Archivo | Cambio | Complejidad |
|---------|--------|-------------|
| `valerioPrompts.js` | Reescribir prompt | Baja |
| `useValerioVoice.js` | Agregar streaming | Media |
| `ValerioConversationArea.jsx` | Componente streaming | Media |
| `valerioMemory.js` | Extender con académica | Media |
| **NUEVO** `valerioAcademicMemory.js` | Crear clase | Media |
| **NUEVO** `useValerioSyncedStream.js` | Crear hook | Media |
| Database: `valerio_memory` → `valerio_academic_memory` | Tabla nueva | Baja |

---

## 🗂️ Tabla de BD Necesaria

```sql
-- Crear tabla de memoria académica en Supabase

CREATE TABLE valerio_academic_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_id INT NOT NULL,
  session_date TIMESTAMPTZ DEFAULT now(),
  
  -- Académico
  topics_covered TEXT[],
  questions_asked TEXT[],
  
  -- Diagnóstico
  weak_areas TEXT[],
  
  -- Progreso
  progress_percentage FLOAT,
  
  -- Próximo
  recommended_next_steps TEXT[],
  
  -- Emocional
  student_sentiment TEXT, -- 'frustrated', 'confused', 'confident', 'engaged'
  
  -- Contexto
  lesson_id INT,
  challenge_id INT,
  
  -- Índices
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES auth.users(id),
  INDEX idx_user_module (user_id, module_id),
  INDEX idx_session_date (user_id, session_date DESC)
);

-- RLS Policy
ALTER TABLE valerio_academic_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own memory"
  ON valerio_academic_memory
  FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
```

---

## 🎯 Resultados Esperados

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Longitud promedio respuesta | 200 palabras | 60 palabras | -70% |
| Tiempo escrita → audio | 3-5s | 0.5-1s (simultaneo) | 5-10x |
| Personalización | Genérica | Académica profunda | N/A |
| Capacidad de memoria | 20 sesiones | 100+ con análisis | 5x |
| Adaptabilidad a estudiante | Mínima | Contextual completa | N/A |

---

## 🚀 Plan de Implementación

### Fase 1: Preparación (2h)
- [ ] Crear tabla en Supabase
- [ ] Crear clase `ValerioAcademicMemory`
- [ ] Crear hook `useValerioSyncedStream`

### Fase 2: Prompts (3h)
- [ ] Reescribir prompts a versión concisa
- [ ] Integrar perfil académico en prompts
- [ ] Test con casos de uso reales

### Fase 3: Streaming (3h)
- [ ] Implementar streaming sincronizado
- [ ] Optimizar TTS para chunks
- [ ] Componente de respuesta viva

### Fase 4: QA (2h)
- [ ] Test end-to-end
- [ ] Verificar memoria académica
- [ ] Test de rendimiento

---

## 💡 Ejemplo de Mejora Real

### ANTES (Valerio actual):
```
"Hola María, excelente pregunta sobre prompts. Un prompt es esencialmente 
una instrucción que le das a un modelo de IA para que genere una respuesta. 
Es como hablar con una persona, pero en este caso estás interactuando con 
una máquina. Los prompts pueden ser simples o complejos. Por ejemplo, puedes 
decir 'escribe un poema' o 'analiza este texto en el contexto de la 
economía moderna y dame tres conclusiones principales'. 

Los buenos prompts tienen características específicas..."

[3-5 segundos de espera]

[Comienza a sonar el audio de todo lo anterior]
```

### DESPUÉS (Valerio mejorado):
```
[TEXTO + AUDIO SIMULTÁNEOS - Se escucha mientras lee]

"Un prompt es la instrucción que le das a la IA. Tipo: 'escribe un poema 
sobre IA' o 'analiza este texto'."

[Valerio percibe que María viene confundida de otro módulo]

"Veo que vienes del módulo de Análisis. Los prompts que usas allá son más 
técnicos, acá enfocamos en claridad. ¿Necesitas un recordatorio rápido?"
```

---

## 📞 Soporte

¿Preguntas sobre implementación?
- Agent: `coder` para implementación
- Agent: `code-reviewer` para verificación
- La sesión puede hacer esto en paralelo
