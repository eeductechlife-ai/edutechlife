# Valentina Rodríguez - Psicóloga Educativa VAK

## Descripción
Valentina Rodríguez es un agente de IA especializado en psicología educativa con 12 años de experiencia en metodología VAK (Visual, Auditivo, Kinestésico). Guía conversacionalmente el proceso de diagnóstico VAK adaptándose dinámicamente a la edad del estudiante (6-17 años).

## Arquitectura del Sistema

### Componentes Principales

#### 1. **ValentinaAvatar.jsx** (`src/components/Valentina/`)
- Avatar animado con 6 expresiones emocionales
- Canvas-based con animaciones fluidas
- Estados: neutral, happy, encouraging, surprised, concerned, thinking
- Responsive para todos los dispositivos

#### 2. **ValentinaChatBubble.jsx** (`src/components/Valentina/`)
- Burbujas de chat estilizadas con marca corporativa
- Soporte para mensajes de usuario y Valentina
- Timestamps y estilos diferenciados
- Animaciones de entrada/salida

#### 3. **ValentinaControls.jsx** (`src/components/Valentina/`)
- Controles de voz: hablar, pausar, detener
- Configuración de velocidad de voz
- Modo alto contraste
- Versión simplificada para móviles

#### 4. **useValentinaAgent.js** (`src/hooks/`)
- Hook principal que maneja toda la lógica del agente
- Integración con OpenAI API
- Gestión de memoria de conversación
- Adaptación de lenguaje por edad
- Control de expresiones del avatar

#### 5. **StudentContext.js** (`src/contexts/`)
- Contexto global para datos del estudiante
- Persistencia de edad y preferencias
- Historial de conversación compartido
- Sincronización entre componentes

### Integración con Diagnóstico VAK

#### DiagnosticoVAK.jsx (`src/components/DiagnosticoVAK/`)
- Campo de edad obligatorio en formulario de calibración
- Panel de Valentina integrado en la interfaz
- Sincronización de estado con StudentContext
- Exportación PDF con comentarios personalizados de Valentina

### Sistema de Mensajes por Edad

#### valentinaMessages.js (`src/utils/`)
- Mensajes predefinidos para 3 grupos de edad:
  - **6-10 años**: Lenguaje simple, emojis, tono amigable
  - **11-14 años**: Lenguaje claro, explicaciones detalladas
  - **15-17 años**: Lenguaje profesional, enfoque en autonomía
- Sistema de templates dinámicos
- Adaptación de vocabulario y complejidad

### Sistema de Voz

#### speech.js (`src/utils/`)
- 3 perfiles de voz para Valentina:
  - `valentina_child` (6-10 años): Voz más aguda, ritmo lento
  - `valentina` (11-14 años): Voz profesional estándar
  - `valentina_teen` (15-17 años): Voz profesional, ritmo más rápido
- Fallback a voz nativa del navegador
- Control de pitch, rate y volumen

## Flujo de Trabajo

### 1. Inicialización
```javascript
// En DiagnosticoVAK.jsx
const { student, updateStudent } = useStudent();
const valentina = useValentinaAgent(student.age);
```

### 2. Diagnóstico Conversacional
1. Usuario ingresa edad (6-17 años)
2. Valentina se presenta adaptando su lenguaje
3. Guía a través de las 4 fases del diagnóstico:
   - Introducción y calibración
   - Test VAK (30 preguntas)
   - Resultados y análisis
   - Estrategias personalizadas

### 3. Post-Diagnóstico
- Comentarios personalizados según resultados
- Recomendaciones específicas por estilo de aprendizaje
- Exportación PDF con análisis completo
- Opciones de seguimiento

## Personalización por Edad

### Grupo 6-10 años
- **Lenguaje**: Simple, concreto, uso de metáforas visuales
- **Tono**: Amigable, alentador, uso de emojis
- **Velocidad**: Habla más lenta (0.9x)
- **Contenido**: Ejemplos prácticos, juegos mentales

### Grupo 11-14 años
- **Lenguaje**: Claro, explicativo, balance técnico/amigable
- **Tono**: Profesional pero accesible
- **Velocidad**: Normal (1.0x)
- **Contenido**: Explicaciones detalladas, analogías

### Grupo 15-17 años
- **Lenguaje**: Profesional, técnico, enfocado en autonomía
- **Tono**: Respetuoso, colaborativo
- **Velocidad**: Ligeramente más rápido (1.1x)
- **Contenido**: Estrategias avanzadas, planificación académica

## Estilos y Diseño

### Paleta de Colores
- **Petróleo**: `#004B63` (títulos, bordes)
- **Corporativo**: `#4DA8C4` (acentos, botones)
- **Menta**: `#66CCCC` (fondo, highlights)
- **Azul suave**: `#B2D8E5` (fondos secundarios)

### Tipografía
- **Títulos**: Montserrat (600 weight)
- **Cuerpo**: Open Sans (400 weight)
- **Tamaños responsive**: 13px-16px base

### Responsive Design
- **Desktop**: Panel lateral completo
- **Tablet**: Panel reducido, controles simplificados
- **Mobile**: Panel emergente, controles minimalistas

## API y Configuración

### Variables de Entorno
```env
VITE_OPENAI_API_KEY=tu_api_key
VITE_GOOGLE_TTS_API_KEY=tu_tts_key
```

### Prompt del Sistema (prompts.js)
```javascript
PROMPT_VALENTINA_PSICOLOGA: `
Eres Valentina Rodríguez, psicóloga educativa especialista en VAK...
Adapta tu lenguaje según la edad del estudiante...
`
```

## Manejo de Errores

### Errores Comunes
1. **API no disponible**: Fallback a respuestas predefinidas
2. **Voz no disponible**: Mostrar texto solamente
3. **Edad no válida**: Validación en tiempo real
4. **Memoria llena**: Limpieza automática del historial

### Logging
- Console logs detallados en desarrollo
- Errores capturados con try/catch
- Estado del agente visible en UI

## Optimizaciones de Rendimiento

### Lazy Loading
- Componentes cargados bajo demanda
- Bundles separados por funcionalidad
- Code splitting automático

### Memoria
- Historial limitado a 50 mensajes
- Cleanup automático de sesiones antiguas
- Cache de respuestas frecuentes

### Animaciones
- Canvas optimizado para 60fps
- Transiciones CSS hardware-accelerated
- Debounce en eventos de scroll

## Pruebas y QA

### Pruebas Manuales
1. Validar adaptación por edad
2. Probar síntesis de voz
3. Verificar responsive design
4. Validar exportación PDF

### Métricas de Calidad
- Tiempo de respuesta < 2s
- Accuracy de diagnóstico > 90%
- Satisfacción del usuario (feedback)
- Tasa de completación del diagnóstico

## Mantenimiento

### Actualizaciones
1. **Mensajes**: Editar `valentinaMessages.js`
2. **Estilos**: Modificar `Valentina.css`
3. **Prompt**: Actualizar `PROMPT_VALENTINA_PSICOLOGA`
4. **Voz**: Ajustar perfiles en `speech.js`

### Monitoreo
- Uso por grupo de edad
- Tiempos de sesión
- Errores reportados
- Feedback de usuarios

## Archivos Relacionados

```
src/
├── components/
│   ├── Valentina/
│   │   ├── ValentinaAvatar.jsx
│   │   ├── ValentinaChatBubble.jsx
│   │   ├── ValentinaControls.jsx
│   │   ├── ValentinaControlsSimplified.jsx
│   │   └── Valentina.css
│   └── DiagnosticoVAK/
│       └── DiagnosticoVAK.jsx
├── hooks/
│   └── useValentinaAgent.js
├── contexts/
│   └── StudentContext.js
├── utils/
│   ├── valentinaMessages.js
│   ├── speech.js
│   └── prompts.js
└── design-system/
    └── tokens.css
```

## Contribuciones

### Mejoras Futuras
1. Integración con LMS externos
2. Análisis de progreso longitudinal
3. Gamificación del diagnóstico
4. Soporte multilingüe
5. Integración con calendario académico

### Reporte de Issues
- Usar template de GitHub Issues
- Incluir: edad, dispositivo, pasos para reproducir
- Adjuntar screenshots/logs cuando sea posible

---

**Última actualización**: 01/04/2026  
**Versión**: 1.0.0  
**Estado**: Production Ready ✅