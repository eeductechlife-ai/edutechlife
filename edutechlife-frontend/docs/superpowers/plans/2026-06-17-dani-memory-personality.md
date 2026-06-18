# Dani Memory & Personality System Implementation Plan

## Goal
Transform Dani from a generic chatbot into a tutor with persistent memory, adaptive personality, emotional warmth, and cross-session follow-up.

## Files to modify

1. `src/context/SmartBoardKidsContext.jsx` — add daniMemory state, setters, persistence
2. `src/components/kids-dashboard/DaniTutorChat.jsx` — memory parsing, injection, adaptation
3. `src/constants/prompts.es.js` — rewrite PROMPT_DANI_EXPERTO with personality + memory instructions
4. `src/constants/prompts.en.js` — same in English
5. `src/i18n/es.json` + `src/i18n/en.json` — no changes needed unless adding UI strings

## Changes

### 1. SmartBoardKidsContext.jsx — Add daniMemory

After line 57 (`const [streakLog, setStreakLog] = useState([]);`), add:

```jsx
const [daniMemory, setDaniMemory] = useState({
  conversations: [],
  studentProfile: { communicationStyle: null, strengths: [], challenges: [], interests: [] },
  pendingTopics: [],
  interactionCount: 0,
  lastSessionSummary: null,
});
```

Add loading/saving in the useEffect that reads localStorage (around line 132):
```jsx
daniMemory: getLocalStorage(`dani_memory_${userId}`, {
  conversations: [],
  studentProfile: { communicationStyle: null, strengths: [], challenges: [], interests: [] },
  pendingTopics: [],
  interactionCount: 0,
  lastSessionSummary: null,
}),
```

Add setDaniMemory in the setStates block.

Add new function `updateDaniMemory(parsedMemory)`:
```jsx
const updateDaniMemory = useCallback((parsed) => {
  if (!parsed || !parsed.topics) return;
  setDaniMemory(prev => {
    const next = { ...prev };
    next.interactionCount = prev.interactionCount + 1;
    
    // Track topics
    if (parsed.topics?.length) {
      parsed.topics.forEach(topic => {
        const existing = next.pendingTopics.find(t => t.topic === topic);
        if (existing) {
          existing.lastSeen = new Date().toISOString();
          existing.count = (existing.count || 0) + 1;
        } else {
          next.pendingTopics.push({ topic, lastSeen: new Date().toISOString(), count: 1 });
        }
      });
    }

    // Track challenges/strengths
    if (parsed.challengeObserved) {
      if (!next.studentProfile.challenges.includes(parsed.challengeObserved))
        next.studentProfile.challenges.push(parsed.challengeObserved);
      // Keep only last 10
      if (next.studentProfile.challenges.length > 10) next.studentProfile.challenges.shift();
    }
    if (parsed.strengthObserved) {
      if (!next.studentProfile.strengths.includes(parsed.strengthObserved))
        next.studentProfile.strengths.push(parsed.strengthObserved);
      if (next.studentProfile.strengths.length > 10) next.studentProfile.strengths.shift();
    }

    // Track communication style (takes last inferred)
    if (parsed.communicationStyle) {
      next.studentProfile.communicationStyle = parsed.communicationStyle;
    }

    // Track mood
    if (parsed.studentMood) {
      next.studentProfile.lastKnownMood = parsed.studentMood;
    }

    return next;
  });
}, []);
```

Add `getPendingTopicsSummary()` function:
```jsx
const getPendingTopicsSummary = useCallback(() => {
  return daniMemory.pendingTopics
    .filter(t => {
      const daysSince = (Date.now() - new Date(t.lastSeen).getTime()) / 86400000;
      return daysSince > 0.5 && daysSince < 7; // Between 12h and 7 days
    })
    .map(t => `${t.topic} (visto hace ${Math.floor((Date.now() - new Date(t.lastSeen).getTime()) / 3600000)}h, ${t.count} veces)`)
    .join(', ');
}, [daniMemory.pendingTopics]);
```

Add `buildMemoryInjection()` function:
```jsx
const buildMemoryInjection = useCallback(() => {
  const profile = daniMemory.studentProfile;
  const parts = [];
  
  if (profile.communicationStyle) {
    parts.push(`Estilo de comunicación detectado: ${profile.communicationStyle}.`);
  }
  if (profile.challenges.length > 0) {
    parts.push(`Dificultades observadas: ${profile.challenges.slice(-3).join(', ')}.`);
  }
  if (profile.strengths.length > 0) {
    parts.push(`Fortalezas: ${profile.strengths.slice(-3).join(', ')}.`);
  }
  if (profile.lastKnownMood) {
    parts.push(`Último estado de ánimo: ${profile.lastKnownMood}.`);
  }

  const pendingSummary = getPendingTopicsSummary();
  if (pendingSummary) {
    parts.push(`Temas para retomar: ${pendingSummary}.`);
  }

  return parts.length > 0
    ? `## MEMORIA DEL ESTUDIANTE\n${parts.join('\n')}\nUsa esta información para personalizar tu respuesta. Si hay temas pendientes, retómalos brevemente.`
    : '';
}, [daniMemory, getPendingTopicsSummary]);
```

Export all new functions from context.

### 2. DaniTutorChat.jsx — Memory System

#### a) Destructure new context values
Add to the existing destructuring (around line 315-330):
```jsx
daniMemory, updateDaniMemory, buildMemoryInjection,
```

#### b) Parse `<memoria>` block in stream completion
After the stream completes (after `addDaniMessage(assistant, fullResponse)`), add:

```jsx
// Parse <memoria> block (invisible to user)
const memoriaMatch = fullResponse.match(/<memoria>([\s\S]*?)<\/memoria>/);
if (memoriaMatch) {
  try {
    const parsed = JSON.parse(memoriaMatch[1].trim());
    updateDaniMemory(parsed);
  } catch (e) {
    console.warn('[Dani] Error parsing memoria block:', e.message);
  }
}

// Clean memoria block from display text (if we're showing raw response somewhere)
// The streaming response has already been set, but we clean the stored message
const cleanResponse = fullResponse.replace(/<memoria>[\s\S]*?<\/memoria>/, '').trim();
// Use cleanResponse instead of fullResponse for the message
addDaniMessage('assistant', cleanResponse);
```

#### c) Inject memory into the messages array
Before calling `callDeepseekStream`, inject the memory context:

```jsx
const memoryInjection = buildMemoryInjection();
if (memoryInjection) {
  // Inject as a system-like instruction in the messages
  const memoryMsg = { role: 'system', content: memoryInjection };
  // Insert after the main system prompt, before history
  messages.splice(2, 0, memoryMsg); // after [system, context, HERE, ...history, userMsg]
}
```

Or simpler: append memoryInjection to the system prompt content dynamically:
```jsx
let systemPrompt = PROMPT_DANI_EXPERTO;
if (memoryInjection) {
  systemPrompt += '\n\n' + memoryInjection;
}
```

#### d) Add personality-based adaptation
After moodDetection and before building messages, add communication style adaptation:

```jsx
// Personality adaptation based on memory
const communicationStyle = daniMemory?.studentProfile?.communicationStyle;
if (communicationStyle === 'shy') {
  systemPrompt += '\n\n## ADAPTACIÓN: Este estudiante es reservado. Sé especialmente paciente, usa preguntas abiertas y celebra cada intento de participación.';
} else if (communicationStyle === 'direct') {
  systemPrompt += '\n\n## ADAPTACIÓN: Este estudiante es directo. Ve al grano, respuestas concisas, ofrece datos concretos.';
} else if (communicationStyle === 'playful') {
  systemPrompt += '\n\n## ADAPTACIÓN: Este estudiante es juguetón. Usa emojis, ejemplos divertidos, mantén un tono alegre.';
} else if (communicationStyle === 'curious') {
  systemPrompt += '\n\n## ADAPTACIÓN: Este estudiante es curioso. Ofrece datos interesantes, haz preguntas que inviten a explorar más.';
}
```

### 3. prompts.es.js — Rewrite PROMPT_DANI_EXPERTO

Replace the current PROMPT_DANI_EXPERTO with:

```js
export const PROMPT_DANI_EXPERTO = `Eres Dani, un tutor virtual de Edutechlife. Tienes 25 años, eres colombiano y trabajas en una plataforma educativa para estudiantes de 8 a 16 años.

## TU PERSONALIDAD
- Eres cálido y cercano. Hablas como un amigo mayor que sabe mucho.
- Usas un lenguaje natural, no robotico. No empieces todas las respuestas con "¡Hola!".
- Tienes sentido del humor pero sabes cuándo ser serio.
- Te emocionas genuinamente cuando el estudiante logra algo.
- Si el estudiante está frustrado, eres paciente y comprensivo.
- Varía tu vocabulario. No repitas las mismas frases.

## ADAPTACIÓN POR EDAD
- 8-11 años: Usa emojis, lenguaje simple, ejemplos con animales/comida/juegos. Frases cortas.
- 12-14 años: Trátalo como un aprendiz curioso. Ejemplos de la vida real, memes sutiles, lenguaje adolescente apropiado.
- 15-16 años: Trátalo como un par académico. Datos profundos, conexiones interdisciplinarias, respeta su inteligencia.

## ESTRUCTURA DE RESPUESTA
- Máximo 4 párrafos. El primero debe conectar con lo que dijo.
- No uses siempre la misma estructura. Varía: a veces una pregunta, a veces un dato curioso, a veces un reto.
- Termina con una invitación a seguir explorando, no siempre con una pregunta.
- Si el estudiante escribió una palabra o frase corta, no respondas con un ensayo.

## SEGUIMIENTO (solo si aplica)
Si ves en el contexto que hay temas pendientes o conversaciones anteriores, menciónalos brevemente:
"La última vez estábamos viendo [tema], ¿has podido practicar?"
"Hace unos días me preguntaste sobre [tema], ¿quieres profundizar?"

## TEMAS EMOCIONALES
- Si el estudiante muestra frustración, valida su sentimiento primero antes de dar consejo.
- Si está emocionado por un logro, celebra con él genuinamente.
- Si notas un patrón (ej. siempre pregunta lo mismo), ofrécele ayuda más profunda.

## REGLAS TÉCNICAS
1. Responde SIEMPRE en el mismo idioma del estudiante.
2. Máximo 4 párrafos.
3. No uses markdown.
4. Si te preguntan por temas fuera de educación, redirige amablemente.
5. Si necesitas mostrar un dato visual, usa <!CHART> o <!VIDEO>.
6. Si el estudiante está en crisis emocional, prioriza el apoyo.`;
```

### 4. prompts.en.js — Same structure in English

Translate the above naturally (not word-for-word) to English, keeping all the same sections.

### 5. Verify build

Run `npx vite build` from edutechlife-frontend.
