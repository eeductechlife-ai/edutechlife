# Nico Call Center Agent — Design Spec

## Overview

Transform Nico from a basic FAQ chatbot into a full EdutechLife call center agent:
- **Hybrid knowledge**: local instant answers (knowledge engine) + DeepSeek streaming for complex queries
- **Proactive sales mode**: after 5 messages, Nico initiates conversations like a call center agent
- **Voice-first**: TTS bugs fixed, streaming audio, cross-browser compatible
- **Fast**: first token <1s via streaming, local answers in <50ms

## Architecture

```
NicoModern.jsx
├── nicoKnowledge.js    ← new: intent matching + local responses
├── nicoConversation.js ← new: phase management + proactive triggers
├── NicoModern.jsx      ← modified: integrate knowledge engine + streaming + TTS fixes
└── nico-training-data.json ← expanded: full services, prices, sales scripts
```

### Data Flow

1. User sends message
2. `matchIntent(text)` → checks local knowledge engine
3. **Match found** → instant response (no API call) + TTS
4. **No match** → `callDeepseekStream()` → streaming response + TTS
5. After response → `shouldInsertProactiveMessage()` → if true, insert proactive sales message
6. Voice: TTS plays after each assistant message (if `audioEnabled`)
7. `setIsSpeaking(false)` called in `onPermissionError` (5th arg) — bugfix

## Component 1: nicoKnowledge.js

Local intent-response engine. ~250 lines, zero dependencies.

### Intent Structure

```js
{
  intents: [
    {
      id: 'precios_vak',
      patterns: [
        'cuánto cuesta vak',
        'precio vak',
        'valor del diagnóstico vak',
        'costo vak',
        'cuánto vale vak',
        'precios vak'
      ],
      category: 'precios',
      proactive_category: 'vak',  // for proactive suggestions
      response: 'El diagnóstico VAK tiene un costo de $X. Incluye una evaluación completa de tu estilo de aprendizaje con resultados detallados y recomendaciones personalizadas.'
    }
  ]
}
```

### Categories for Proactive Suggestions

| Category | Proactive | Priority |
|----------|-----------|----------|
| precios  | true      | 1        |
| servicios | true     | 2        |
| inscripcion | true   | 3        |
| generales | false    | 4        |

### Matching Algorithm

1. Normalize text (lowercase, remove accents)
2. Check for exact pattern matches across all intents
3. Return first match (ordered by priority within category)
4. If partial match confidence > 0.7, return with warning
5. No match → return `null` → triggers DeepSeek

### Coverage (40+ intents)

- Prices: VAK, STEM, tutoring, wellness, English
- Schedules: hours, modalities (online/presential/hybrid)
- Ages: all age groups
- Enrollment: process, requirements, free first class
- Payment: methods, plans, promotions
- Cancellation: policy, no permanence
- Contact: WhatsApp, email, location
- FAQs: common questions about each service
- Objections: "it's expensive", "no time", "not sure"
- Support: technical issues, account problems

## Component 2: nicoConversation.js

Manages conversation phase and proactive messaging.

### Phases

| Phase | Messages | Behavior |
|-------|----------|----------|
| Reactive (Fase 1) | 1-4 | Answer only, build profile, detect interests |
| Proactive (Fase 2) | 5+ | Insert sales questions every 3 user messages |

### Proactive Message Selection

Based on context:
1. Detected interests (most recent topic)
2. Undiscussed services (ones not mentioned yet)
3. Lead capture stage (if no lead captured after 5 messages)
4. User profile (age, name for personalization)

### Proactive Message Types

- "¿Sabías que tenemos primera clase gratuita en [servicio]?"
- "¿Te gustaría conocer nuestros planes de [tema]?"
- "Muchos padres de [edad] también están interesados en [servicio complementario]"
- "¿Qué te parece si agendamos una llamada gratis con un especialista?"

## Changes to NicoModern.jsx

### TTS Fixes (4 bugs)

**Line 1416 — CRITICAL**: `setIsSpeaking(false)` in wrong argument
```js
// BEFORE (broken):
speakTextConversational(textToSpeak, 'nico_premium',
  () => setIsSpeaking(false),  // 3rd arg = overrides — NEVER CALLED
  setAudioPermissionError      // 4th arg = onEndCallback — wrong function
);

// AFTER (fixed):
speakTextConversational(textToSpeak, 'nico_premium',
  {},                          // overrides = empty object
  undefined,                   // onEndCallback = none
  () => setIsSpeaking(false)   // onPermissionError = actual callback
);
```

**11 calls to fix**: 737, 925, 1095, 1117, 1178-1182, 1189-1194, 1255-1260, 1416, 1503, 1511, 1600

### Streaming Migration

Replace `callDeepseek` with `callDeepseekStream`:
- Import `callDeepseekStream` from api.js (already exists)
- Stream response text to UI progressively
- No more 30s blocking wait

### Remove Redundant Truncation

- Delete `simplifyResponse()` function (lines 108-129)
- Remove 500-char truncation in API.js (lines 110-111) — only affects legacy format

## Cross-Platform

### Safari Compatibility
- Replace `AbortSignal.timeout(20000)` in speech.js line 444 with `AbortController` (manual timeout)
- Safari does not support `AbortSignal.timeout()`

### Mobile
- Touch events already handled by `ensureUserInteraction()`
- Responsive layout already in place
- MP3 audio (Google TTS backend) supported on all mobile browsers

### Audio Fallback Chain
1. Google TTS backend → MP3 (all browsers)
2. Backend unavailable → Native SpeechSynthesis (browser built-in voices)
3. Autoplay blocked → Wait for user gesture, retry
4. Permission denied → Report error via `onPermissionError`

## Files Changed

| File | Change |
|------|--------|
| `src/components/Nico/nicoKnowledge.js` | **NEW** — intent engine |
| `src/components/Nico/nicoConversation.js` | **NEW** — phase management |
| `src/components/Nico/NicoModern.jsx` | **MODIFY** — integrate knowledge + streaming + TTS fixes |
| `src/components/Nico/nico-training-data.json` | **MODIFY** — expand data |
| `src/utils/speech.js` | **MODIFY** — Safari AbortSignal fix |

## Files Not Changed

- `src/utils/api.js` — already has streaming (`callDeepseekStream`)
- `src/utils/textCleaner.js` — not needed
- `src/components/Nico/LeadCaptureForm.jsx` — not needed
- `src/components/Nico/AppointmentScheduler.jsx` — not needed

## Success Criteria

1. Nico responds to common questions instantly (<50ms) from local knowledge
2. Complex questions answered via streaming (<1s first token)
3. Voice works on first click AND subsequent clicks (TTS callback fix)
4. Proactive sales messages appear after message 5+
5. Works on Chrome, Safari, mobile, tablet
