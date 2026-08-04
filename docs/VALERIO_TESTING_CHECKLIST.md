# ✅ VALERIO 3.0 - Testing Checklist

**Fecha:** 3 de agosto de 2026  
**Estado:** Listo para QA

---

## 🧪 Testing End-to-End

### Fase 1: Verificación de Código (5 minutos)

```bash
# 1. Verificar que no hay errores de sintaxis
cd edutechlife-frontend
npm run build

# 2. Verificar que se importan correctamente
grep -r "ValerioAcademicMemory\|useStreamingWithAudio" src/

# 3. Verificar archivos creados
ls -la src/services/valerioAcademicMemory.js
ls -la src/components/IALab/IALabValerioPanel/ValerioStreamingOptimized.jsx
```

---

### Fase 2: Verificación en Supabase (2 minutos)

**En Supabase Dashboard:**

```sql
-- Verificar tabla existe
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'valerio_academic_memory';

-- Verificar RLS policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'valerio_academic_memory';

-- Debería mostrar:
-- Users see own academic memory
-- Service role full access
```

**Resultado esperado:**
```
✅ Tabla creada
✅ Índices activos
✅ RLS policies aplicadas
```

---

### Fase 3: Test en Navegador (10 minutos)

**1. Abrir IALab en navegador**
```
http://localhost:5173/ialab  (desarrollo)
https://edutechlife.co/ialab (producción)
```

**2. Abrir Valerio (click en chat)**
- [ ] Panel se abre sin errores
- [ ] Mensaje de bienvenida personalizado
- [ ] Botones de acciones rápidas visibles

**3. Hacer una pregunta**
```
"¿Qué es un prompt?"
```

**Verificar:**
- [ ] Texto aparece en VIVO (no de repente)
- [ ] Audio comienza rápido (< 1 segundo)
- [ ] Respuesta es corta (máximo 60 palabras)
- [ ] Sin asteriscos ni formato especial
- [ ] Sonido es claro y natural

**4. Hacer segunda pregunta**
```
"Dame un ejemplo práctico"
```

**Verificar:**
- [ ] Respuesta continúa siendo corta
- [ ] Tono sigue siendo natural
- [ ] Sistema sigue siendo rápido

**5. Cierra panel y reabre**
- [ ] Conversación se guardó (historial visible)
- [ ] Valerio recuerda contexto
- [ ] Mensajes anteriores están presentes

---

### Fase 4: Test de Memoria Académica (5 minutos)

**En DevTools Console:**

```javascript
// Verificar que se están grabando sesiones
const userId = window.Clerk?.session?.user?.id;
console.log('User ID:', userId);

// Verificar sistema async
const prompt = document.querySelector('[data-prompt]');
if (prompt?.textContent?.includes('Contexto del estudiante')) {
  console.log('✅ Prompt personalizado activo');
} else {
  console.log('⏳ Prompt personalizado pendiente');
}
```

**En Supabase SQL Editor:**

```sql
-- Ver sesiones grabadas
SELECT user_id, student_sentiment, topics_covered, session_date
FROM valerio_academic_memory
ORDER BY session_date DESC
LIMIT 5;
```

**Resultado esperado:**
```
user_id     | sentiment | topics_covered        | session_date
your_id     | neutral   | ['prompts']           | 2026-08-03...
your_id     | confident | ['examples']          | 2026-08-03...
```

---

### Fase 5: Test de Error Handling (5 minutos)

**Escenario 1: Sin BD disponible**
```javascript
// Simular error de BD
// (En desarrollo, desactivar conexión a Supabase)
// Valerio debería seguir funcionando normalmente
```

**Resultado esperado:**
- ✅ Valerio responde igual
- ✅ Solo sin personalización académica
- ✅ Fallback silencioso (no muestra error)

**Escenario 2: Internet lento**
```
- Pregunta algo a Valerio
- Simular conexión lenta (DevTools throttle)
```

**Resultado esperado:**
- ✅ Texto sigue streaming
- ✅ Audio se reproduce gradualmente
- ✅ No se congela la UI

---

### Fase 6: Test de Mobile (5 minutos)

**Abrir en móvil o simular:**

```javascript
// DevTools → F12 → Toggle device toolbar
// Simular iPhone 12
```

**Verificar:**
- [ ] Panel se abre completo
- [ ] Botones son clickeables
- [ ] Texto es legible
- [ ] Audio funciona
- [ ] Scroll funciona

---

### Fase 7: Test de Performance (5 minutos)

**En DevTools Performance:**

```javascript
// 1. Medir tiempo de primera pregunta
console.time('first_question');
// [haz una pregunta]
console.timeEnd('first_question');
// Debería ser < 2 segundos

// 2. Medir tiempo de respuesta
console.time('response_time');
// [espera respuesta]
console.timeEnd('response_time');
// Debería ser < 5 segundos total

// 3. Ver memory usage
console.log('Memory:', performance.memory);
```

**Benchmarks esperados:**
- ⚡ Primera respuesta: < 2s
- ⚡ Streaming: 0.5-1s (paralelo)
- 💾 Memory leak: Ninguno

---

## 📋 Testing Funcional

### ✅ Respuestas Concisos

**Before (Valerio 2.0):**
```
"Un prompt es esencialmente una instrucción que le das a un 
modelo de IA para que genere una respuesta. Es como hablar 
con una persona, pero en este caso estás interactuando con 
una máquina. Los prompts pueden ser simples o complejos..."
```

**After (Valerio 3.0):**
```
"Un prompt es la instrucción que le das a la IA para que 
responda. Por ejemplo: 'escribe un poema' o 'analiza este texto'."
```

✅ **-70% de longitud**

---

### ✅ Personalización Académica

**Sesión 1:**
```
Estudiante: "¿Qué es un prompt?"
Valerio: "Es una instrucción que le das a la IA."
```

**Sesión 2 (Valerio recuerda):**
```
Estudiante: "No entiendo cómo hacer prompts complejos"
Valerio: "Veo que ayer preguntaste sobre prompts básicos. 
Para complejos, necesitas..."
```

✅ **Personalización activa**

---

### ✅ Streaming Paralelo

**Antes:**
```
[Escribe respuesta completa] → [Espera 3-5s] → [Habla]
```

**Después:**
```
[Escribe primera línea] → [Habla primera línea en paralelo]
[Escribe segunda línea] → [Habla segunda línea mientras escribe]
→ **Simultáneo desde el inicio**
```

---

## 🎯 Criterios de Aceptación

### ✅ Funcionales

- [ ] Valerio abre sin errores
- [ ] Responde a preguntas correctamente
- [ ] Respuestas son concisos (<60 palabras)
- [ ] Texto + audio paralelo (<1 segundo)
- [ ] Conversación se guarda
- [ ] Valerio recuerda contexto

### ✅ Técnicos

- [ ] No hay errores en console
- [ ] No hay memory leaks
- [ ] Base de datos graba sesiones
- [ ] Fallbacks funcionan sin BD
- [ ] Performance es consistente

### ✅ UX

- [ ] Interfaz responsive en mobile
- [ ] Botones son clickeables
- [ ] Audio es claro
- [ ] Experiencia es fluida
- [ ] No hay lag o congelamiento

---

## 🐛 Bugs Conocidos / No Encontrados

*(Espacio para documentar si hay algo)*

---

## 📊 Resultados Esperados Post-QA

| Métrica | Meta | Status |
|---------|------|--------|
| Build sin errores | ✅ | - |
| Console sin errores | ✅ | - |
| BD graba sesiones | ✅ | - |
| Prompts < 60 palabras | ✅ | - |
| Streaming < 1s | ✅ | - |
| Mobile responsive | ✅ | - |
| Performance > 60fps | ✅ | - |
| Memory sin leaks | ✅ | - |

---

## 📝 Template para Reportar Issues

Si encuentras algo:

```markdown
## Bug Report: [TITLE]

**Descripción:**
[Qué pasó]

**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Resultado esperado:**
[Qué debería pasar]

**Resultado actual:**
[Qué pasó realmente]

**Screenshots:**
[Si es posible, incluye screenshots]

**Severidad:**
- [ ] Crítica (no funciona)
- [ ] Alta (funciona mal)
- [ ] Media (inconveniente)
- [ ] Baja (cosmética)
```

---

## ✅ Sign-off Checklist

Cuando hayas completado todo el testing:

- [ ] Todas las fases completadas
- [ ] Criterios de aceptación cumplidos
- [ ] No hay bugs críticos abiertos
- [ ] Performance es aceptable
- [ ] Mobile funciona bien
- [ ] Documentación está actualizada

**Signature:** _________________  
**Fecha:** _________________  

---

## 🚀 Post-Deployment

Una vez que pase QA:

1. **Merge a main**
   ```bash
   git add .
   git commit -m "feat: Valerio 3.0 - Academic memory, streaming optimization, concise prompts"
   git push origin valerio-3.0
   # Crear PR en GitHub
   ```

2. **Deploy a staging**
   - Vercel automático
   - Test en https://staging.edutechlife.co

3. **Deploy a producción**
   - Coordinar con team
   - Monitor de errores por 24h

4. **Anunciar a usuarios**
   - "Valerio es ahora más rápido y personalizado"
   - Link a blog post o changelog

---

**Creado:** 3 de agosto de 2026  
**Checklist versión:** 1.0  
**Status:** Listo para testing
