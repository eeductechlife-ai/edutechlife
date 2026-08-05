# Guía de Implementación - Valerio 3.0

**Estado:** Archivos creados y listos para integración  
**Tiempo estimado:** 2-3 horas de trabajo

---

## ✅ Fase 1: Base (COMPLETADA)

Los siguientes archivos han sido creados:

### 1. **valerioAcademicMemory.js**
- **Ruta:** `src/services/valerioAcademicMemory.js`
- **Función:** Clase para almacenar y analizar datos académicos
- **Métodos clave:**
  - `recordSession()` - Guardar sesión académica
  - `getStudentProfile()` - Obtener perfil del estudiante
  - `buildPersonalizedContext()` - Contexto personalizado para prompts

### 2. **useValerioSyncedStream.js**
- **Ruta:** `src/hooks/IALab/useValerioSyncedStream.js`
- **Función:** Hook para streaming sincronizado (texto + audio simultáneamente)
- **Métodos clave:**
  - `streamWithAudio()` - Stream texto y audio en paralelo
  - `cancel()` - Cancelar stream
  - `reset()` - Reiniciar estado

### 3. **020_valerio_academic_memory.sql**
- **Ruta:** `supabase/migrations/020_valerio_academic_memory.sql`
- **Función:** Tabla de base de datos para memoria académica
- **Características:**
  - RLS policies automáticas
  - Índices para rendimiento
  - Campos para emociones, temas, progreso

### 4. **valerioPrompts.js (Modificado)**
- **Cambios:**
  - ✅ Prompts reescritos (más concisos, máximo 2-3 párrafos)
  - ✅ Removido "sin límite de extensión"
  - ✅ Removido "SIEMPRE completa tus respuestas"
  - ✅ Función `buildValerioSystemPrompt()` ahora es async
  - ✅ Integración de memoria académica

---

## 🚀 Fase 2: Integración (PRÓXIMA)

### Paso 1: Crear tabla en Supabase

```bash
# Opción A: Usar Supabase Dashboard
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto edutechlife
3. SQL Editor → New query
4. Copia el contenido de: supabase/migrations/020_valerio_academic_memory.sql
5. Click "Run"

# Opción B: Usar CLI (si tienes configurado)
npx supabase migration up
```

**Verificar:**
```sql
-- En Supabase SQL Editor, ejecutar:
SELECT name FROM pg_tables WHERE tablename = 'valerio_academic_memory';
```

Debería devolver: `valerio_academic_memory`

---

### Paso 2: Integrar en ValerioConversationArea.jsx

**Archivo:** `src/components/IALab/IALabValerioPanel/ValerioConversationArea.jsx`

**Buscar:** El componente que maneja mensajes de Valerio

**Agregar imports:**
```javascript
import { useValerioSyncedStream } from "../../../hooks/IALab/useValerioSyncedStream";
import { ValerioAcademicMemory } from "../../../services/valerioAcademicMemory";
```

**Reemplazar la lógica de streaming:**

```javascript
// ANTES (aproximado):
const response = await fetch('/api/valerio/chat', {...});
const text = await response.text();
// Esperar 3-5s antes de reproducir audio...

// DESPUÉS:
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ValerioConversationArea = ({ currentModule, studentName, /* ... */ }) => {
  const { textChunks, isStreaming, audioUrl, streamWithAudio } = useValerioSyncedStream();
  const supabaseClient = useSupabaseClient();
  const userId = window.Clerk?.session?.user?.id;

  const sendMessage = async (userInput) => {
    // 1. Construir prompt CON memoria académica
    const systemPrompt = await buildValerioSystemPrompt({
      locale,
      currentModule,
      modules,
      studentName,
      userLevel,
      completedModules,
      t,
      currentLesson,
      supabaseClient, // NUEVO
      userId,          // NUEVO
    });

    // 2. Stream con audio sincronizado
    await streamWithAudio(
      () => fetch('/api/valerio/chat', {
        method: 'POST',
        body: JSON.stringify({ systemPrompt, userInput }),
      }),
      async (text) => {
        // Función TTS - convertir texto a audio
        return await googleTTS(text, locale);
      },
      { minChunkLength: 50, maxChunkWait: 1000 }
    );

    // 3. Guardar sesión en memoria académica
    if (supabaseClient && userId) {
      const academicMemory = new ValerioAcademicMemory(supabaseClient, userId);
      await academicMemory.recordSession({
        moduleId: currentModule.id,
        topicsCovered: extractTopics(userInput), // helper function
        questionsAsked: [userInput],
        progressMade: calculateProgress(), // helper function
        sentiment: detectSentiment(userInput), // helper function
      });
    }
  };

  return (
    <div>
      {/* Mostrar texto en vivo mientras se genera */}
      {textChunks.map((chunk, i) => (
        <span key={i}>{chunk}</span>
      ))}
      {isStreaming && <span className="animate-pulse">▌</span>}

      {/* Audio se reproduce automáticamente mientras se genera */}
      {audioUrl && (
        <audio autoPlay key={audioUrl}>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};
```

---

### Paso 3: Actualizar contexto de chat

**Archivo:** Donde se llama a `/api/valerio/chat` (backend)

**Cambiar de:**
```javascript
const systemPrompt = buildValerioSystemPrompt({...});
```

**A:**
```javascript
const systemPrompt = await buildValerioSystemPrompt({
  // ... parámetros anteriores ...
  supabaseClient,  // Agregar
  userId,          // Agregar
});
```

**Importante:** La función ahora retorna una Promise, así que usa `await`.

---

### Paso 4: Test de memoria académica

**En ValerioConversationArea o donde guardes sesiones:**

```javascript
// Al finalizar conversación:
const academicMemory = new ValerioAcademicMemory(supabaseClient, userId);

// Registrar sesión
await academicMemory.recordSession({
  moduleId: 1,
  topicsCovered: ['prompt engineering', 'IA'],
  questionsAsked: ['¿Qué es un prompt?', '¿Cómo se estructura?'],
  weakAreasIdentified: ['formulación de prompts complejos'],
  progressMade: 75,
  sentiment: 'confident',
});

// Obtener perfil para verificar
const profile = await academicMemory.getStudentProfile();
console.log('Perfil académico:', profile);
// Output: { strongTopics: [...], weakTopics: [...], ... }
```

---

## 📊 Fase 3: Verificación

### Test 1: Tabla creada
```sql
SELECT COUNT(*) FROM valerio_academic_memory;
-- Debería devolver: 0 (tabla vacía pero existente)
```

### Test 2: Prompts más concisos
1. Abre la IALab en navegador
2. Ingresa a un módulo
3. Pregunta algo a Valerio
4. **Resultado esperado:** Respuesta en máximo 2-3 párrafos (60-90 palabras)

### Test 3: Memoria académica
```javascript
// En DevTools console:
const userId = window.Clerk.session.user.id;
const supabaseClient = window.supabaseClient; // O cómo accedas a él

const academicMemory = new ValerioAcademicMemory(supabaseClient, userId);
const profile = await academicMemory.getStudentProfile();
console.log(profile);
```

### Test 4: Streaming sincronizado
1. Abre DevTools (F12)
2. Pregunta a Valerio
3. **Resultado esperado:** Texto + audio aparecen simultáneamente (no 3-5s de espera)

---

## 🔧 Troubleshooting

### Error: "Cannot read property 'getStudentProfile'"
**Causa:** ValerioAcademicMemory no está importada  
**Solución:**
```javascript
import { ValerioAcademicMemory } from "../../../services/valerioAcademicMemory";
```

### Error: "buildValerioSystemPrompt is not a function"
**Causa:** La función es async y no se está usando `await`  
**Solución:**
```javascript
// ANTES:
const prompt = buildValerioSystemPrompt({...});

// DESPUÉS:
const prompt = await buildValerioSystemPrompt({...});
```

### Error: "Table valerio_academic_memory does not exist"
**Causa:** La migración no se ejecutó  
**Solución:**
1. Ve a Supabase Dashboard
2. SQL Editor → New query
3. Copia el SQL de `supabase/migrations/020_valerio_academic_memory.sql`
4. Click "Run"

### Audio no se reproduce
**Causa:** TTS service no está configurado  
**Solución:** Verifica que `googleTTS()` o tu servicio TTS actual está funcionando

---

## 📈 Resultados Esperados (después de integración)

| Métrica | Antes | Después |
|---------|-------|---------|
| Longitud respuesta | 200 palabras | 60-90 palabras |
| Tiempo escrita → audio | 3-5s | 0.5-1s (simultáneo) |
| Personalización | Genérica | Académica profunda |
| Capacidad de memoria | 20 sesiones | 100+ con análisis |
| Adaptabilidad | Mínima | Contextual |

---

## 🎯 Próximos Pasos

1. **Hoy:** Crear tabla en Supabase ✅
2. **Mañana:** Integrar en ValerioConversationArea
3. **Día 3:** Test end-to-end completo
4. **Día 4:** Deploy a producción

---

## 📞 Soporte

¿Preguntas? Revisa:
- `VALERIO_ENHANCEMENT_PLAN.md` - Plan conceptual completo
- `valerioAcademicMemory.js` - Documentación de métodos
- `useValerioSyncedStream.js` - Hook documentation

---

**¡Listo para comenzar!** 🚀
