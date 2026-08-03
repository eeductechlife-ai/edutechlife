# Portuguese (pt.json) QA Checklist

**Objetivo:** Validar que el soporte en Portugués brasileño funciona correctamente en todos los módulos de IALab.

**Estado:** Implementado en producción (pt.json + I18nProvider)

---

## ✅ Validación Técnica

### JSON Validity
- [x] pt.json es JSON válido (4,401 strings)
- [x] I18nProvider importa pt.json dinámicamente
- [x] SUPPORTED_LOCALES incluye 'pt'
- [x] getInitialLocale valida 'pt'
- [x] Build frontend exitoso (pt-CjvYZydr.js)

### Storage & Persistence
- [ ] localStorage guarda preferencia locale 'pt'
- [ ] Recargar página mantiene idioma seleccionado
- [ ] Cambiar de pestaña y volver: idioma persiste
- [ ] Limpiar localStorage: vuelve a español (default)

---

## 🎨 Validación de Interfaz

### Language Selector
- [ ] Selector muestra 3 opciones: Español | English | Português
- [ ] Click en "Português" cambia la UI
- [ ] Animación suave de cambio de idioma
- [ ] Icon/flag de Portugal visible
- [ ] Tooltip explica qué es Português

### Sidebar (Navegación Principal)
```
ANTES (ES)              DESPUÉS (PT)
─────────────────────────────────────
Progreso del Curso  →   Progresso do Curso
Módulos del Curso   →   Módulos do Curso
Insignias           →   Insignias
Certificado         →   Certificado
Nivel {level}       →   Nível {level}
Inicio              →   Início
Cerrar Sesión       →   Sair
```

### Dashboard
- [ ] "Tu Progreso" → "Seu Progresso"
- [ ] "Módulos completados" → "Módulos concluídos"
- [ ] Porcentajes se muestran: "80% Concluído"
- [ ] Badges: "Conquistadas" (en lugar de "Ganadas")

### Módulos IALab
- [ ] Nombre: "IA Lab Acadêmico"
- [ ] Objetivos: translated
- [ ] Contenido: "Conteúdo"
- [ ] Actividades: "Atividades"
- [ ] Práctica: "Prática"

### Gamification
- [ ] Streak: "Sequência {tier}" (en lugar de "Racha")
- [ ] XP: "Pontos" (en lugar de "Puntos")
- [ ] Level: "Nível"
- [ ] Badges: "Insignias"

### Coach Valerio
- [ ] Saludos en portugués
- [ ] Mensajes contextuales en PT
- [ ] Respuestas coherentes

### Modals & Dialogs
- [ ] "Parabéns! Você concluiu..." (en lugar de "¡Felicitaciones! Has terminado...")
- [ ] "Certificado conquistado"
- [ ] Botones: "Sim" (en lugar de "Sí")

---

## 🎯 Validación de Módulos IALab

### Módulo 1 (Artesano Digital)
- [ ] Título traducido: "Artesão Digital"
- [ ] Descripción pedagógica en PT
- [ ] Desafíos con enunciados en PT
- [ ] Evaluación clara en PT

### Módulo 2-5
- [ ] Nombres: Arquitecto → Arquiteto, Detective → Detetive, etc.
- [ ] Contenido pedagógico coherente
- [ ] Términos técnicos correctos (IA → IA, prompt → prompt, etc.)
- [ ] Evaluación funciona

### Quiz & Examen
- [ ] Preguntas en PT
- [ ] Opciones múltiples claras
- [ ] Feedback en PT
- [ ] Calificación visible: "{score}% Concluído"

### Recursos
- [ ] Links y títulos en PT
- [ ] Descripción de recursos
- [ ] Fecha de acceso legible

---

## 📱 Validación Responsive

### Mobile (375px)
- [ ] Selector idioma accesible
- [ ] Texto no se corta
- [ ] Sidebar scrollable
- [ ] Botones clickeables

### Tablet (768px)
- [ ] Layout legible
- [ ] Interacciones suaves
- [ ] Selector visible

### Desktop (1280px+)
- [ ] UI completa visible
- [ ] Textos alineados
- [ ] No hay overflow

---

## 🌐 Validación Pedagógica

### Coherencia Educativa
- [ ] Tono formal pero accesible
- [ ] Términos pedagógicos correctos
- [ ] No hay anglicismos innecesarios
- [ ] Consistencia terminológica (IA siempre es "IA", no "Inteligência Artificial" acortado)

### Ejemplos de Validación

```
Término Técnico:      Validar:
─────────────────────────────────────────
prompt              → prompt (no traducir)
IA                  → IA (no "I.A" ni "Inteligência")
ChatGPT             → ChatGPT (mantener marca)
Gemini              → Gemini (mantener marca)
Racha de estudio    → Sequência de estudo
Streak              → Sequência (en contexto gamificación)
Badge/Insignia      → Insignia (mantener)
XP/Puntos           → Pontos (para XP)
Módulo              → Módulo (no "Unidade")
Desafío             → Desafio (sin tilde, portugués)
Evaluación          → Avaliação
```

### Ejemplo de Enunciado (Módulo 1)

**ES:**
> "Crea un prompt que le pida a ChatGPT escribir un artículo de 500 palabras sobre IA."

**PT (Esperado):**
> "Crie um prompt que peça ao ChatGPT escrever um artigo de 500 palavras sobre IA."

**Validar:**
- [ ] Traducción gramaticalmente correcta
- [ ] Mantiene el significado educativo
- [ ] ChatGPT y IA no están traducidos

---

## 🔊 Validación de Accesibilidad

### Screen Readers
- [ ] Estructura HTML correcta en PT
- [ ] Labels en PT
- [ ] ARIA attributes funcionales

### Keyboard Navigation
- [ ] Tab order coherente
- [ ] Foco visible
- [ ] Interacciones sin mouse

### Language Attribute
```html
<html lang="pt">
  <!-- Verificar en console: document.documentElement.lang === 'pt' -->
</html>
```

---

## 📊 Validación de Performance

### Bundle Size
- [ ] pt-CjvYZydr.js: ~309 kB (compara con es.json)
- [ ] No impacta carga inicial
- [ ] Lazy load funciona

### Lazy Loading
- [ ] Click en "Português" → loads pt.json
- [ ] Sin bloqueo UI
- [ ] Transición suave

### String Interpolation
- [ ] "{name} completou" funciona
- [ ] "{count} módulos" pluralización
- [ ] No hay broken keys

---

## 🚀 Validación de Despliegue

### Staging
- [ ] Build completa sin warnings
- [ ] Selector idioma visible
- [ ] Cambio a PT funciona
- [ ] localStorage persiste

### Production (Pre-Launch)
- [ ] CDN sirve pt-*.js correctamente
- [ ] Network tab muestra pt.json cargado
- [ ] No hay console errors
- [ ] Performance DevTools OK

### Rollout Gradual
- [ ] Feature flag: 10% tráfico PT
- [ ] Monitor: error rate, bounce rate
- [ ] Feedback usuarios Brasil
- [ ] Scale to 100% si OK

---

## 🧪 Test Cases

### TC-PT-001: Language Selection
```
1. User ve selector: ES | EN | PT
2. User hace click en "Português"
3. UI cambia a PT
4. localStorage['edutechlife_locale'] = 'pt'
5. Reload → PT persiste

PASS: UI en PT, localStorage correcto
```

### TC-PT-002: Module Navigation
```
1. User selecciona PT
2. Navega a Módulo 1
3. Título: "Artesão Digital"
4. Descripción: en PT
5. Quiz: preguntas en PT

PASS: Todos los strings en PT
```

### TC-PT-003: Coach Valerio
```
1. User selecciona PT
2. Abre chat con Valerio
3. Tipo: "Oi Valerio"
4. Respuesta: en PT coherente
5. Mensajes contextuales: PT

PASS: Coach responde en PT
```

### TC-PT-004: Certificate
```
1. User completa Módulo 5 en PT
2. Recibe certificado
3. Título: "Certificado"
4. Texto: en PT
5. Download funciona

PASS: Certificado en PT generado
```

---

## 📋 Checklist de Lanzamiento

### Antes de Go-Live
- [ ] Todos los TCs pasados
- [ ] Performance: <3s carga en PT
- [ ] Staging verde
- [ ] Sentry: sin errores PT
- [ ] PostHog: events registrando idioma PT

### Go-Live (10% tráfico)
- [ ] Monitor error rate: <1%
- [ ] Monitor bounce rate: similar a ES/EN
- [ ] Monitor session duration: similar
- [ ] Feedback usuarios: positivo

### Post-Launch (100% tráfico)
- [ ] Analytics: PT 15-20% de tráfico
- [ ] Satisfaction: igual o mejor vs ES
- [ ] Support tickets: normal
- [ ] Expansion: considerar estrategia Brasil B2B

---

## 📞 Support

Si encuentras strings sin traducir:

1. Reportar en Sentry con idioma PT
2. Localizar la key en pt.json
3. Verificar traducción en es.json
4. Agregar en pt.json si falta
5. Re-deploy sin downtime

---

**Nota:** Este checklist debe completarse ANTES de anunciar público en portugués.

**Estimado:** 4-6h de QA manual + 2h tests automatizados
