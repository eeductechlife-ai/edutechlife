# Plan: Mejorar botones de temas - "Domina las Instrucciones"

## Analisis actual

**Estado actual (ModuleOverviewCard.jsx lineas 85-109):**
- Grid de columna unica con gap-3
- Botones simples con bg-slate-50, border-slate-100, rounded-lg
- Solo un punto generico como indicador
- Texto text-base text-slate-700
- Hover abrupto que llena todo con #004B63

**Problemas identificados:**
1. Botones demasiado planos, sin el look premium del resto de IALab
2. Sin iconos tematicos por tema - solo un punto generico
3. Sin informacion de recursos disponibles por tema
4. Falta jerarquia visual y profundidad
5. Transicion de hover muy brusca

## Diseno IALab a respetar

**Colores corporativos:**
- #004B63 - Petroleum (primario)
- #00BCD4 - Cyan (acento)
- #0A3550 - Petroleum oscuro
- bg-white con glassmorphism sutil

**Patrones visuales:**
- Gradientes: from-[#004B63] to-[#00BCD4]
- Sombras ambientales cyan/petroleum
- Bordes sutiles con transparencias
- Rounded-xl o rounded-2xl
- Tipografia limpia con font-semibold

## Mejoras propuestas

### 1. Estructura del boton mejorada
- Cambiar de botones simples a tarjetas interactivas premium
- Agregar icono FontAwesome tematico por cada tema (cerebro para IA, mensaje para prompt, estructura para estructura basica, herramientas para refinamiento)
- Mostrar contador de recursos disponibles por tema (badge)
- Agregar indicador de dificultad (Principiante/Intermedio)

### 2. Estilo visual premium
- Fondo: bg-white con border-l-4 border-l-[#004B63] para acento lateral
- Sombra sutil: shadow-[0_4px_15px_rgba(0,75,99,0.06)]
- Padding aumentado: px-5 py-4
- Border radius: rounded-xl
- Gap interno: gap-4

### 3. Hover state refinado
- Fondo cambia a gradiente sutil: from-[#004B63]/5 to-[#00BCD4]/5
- Borde lateral se vuelve mas grueso y cyan
- Sombra aumenta: shadow-[0_8px_25px_rgba(0,75,99,0.12)]
- Icono y texto cambian a color petroleum
- Escala suave: scale-1.01 (menos agresivo)

### 4. Contenido interno del boton
Layout horizontal con 3 zonas:
- **Izquierda**: Icono tematico en contenedor cuadrado con gradiente sutil (w-12 h-12 rounded-xl)
- **Centro**: Titulo del tema (text-base font-semibold) + subtitulo con recursos y dificultad
- **Derecha**: Chevron indicando accion (fa-chevron-right)

### 5. Datos de temas mejorados
Agregar al moduleData:
```javascript
topics: [
  {
    title: "Introduccion a la Inteligencia Artificial Generativa",
    icon: "fa-brain",
    resources: 2,
    difficulty: "Principiante"
  },
  {
    title: "Que es un Prompt?",
    icon: "fa-comments",
    resources: 3,
    difficulty: "Principiante"
  },
  ...
]
```

## Implementacion especifica

**Archivo:** edutechlife-frontend/src/components/IALab/ModuleOverviewCard.jsx

**Cambios:**
1. Actualizar estructura de moduleData.topics (lineas 36-41)
2. Reemplazar grid de botones (lineas 85-109) con nueva estructura
3. Agregar import de iconos si es necesario (ya usa Icon de iconMapping)

**Nuevo diseno del boton:**
```
+-------------------------------------------+
| [ICON]  Titulo del Tema            [>]   |
|         2 recursos . Principiente         |
+-------------------------------------------+
```

Con estilos:
- Contenedor: bg-white, border border-slate-100, border-l-4 border-l-[#004B63], rounded-xl
- Icon container: w-12 h-12, rounded-xl, bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10
- Hover: bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5, border-l-[#00BCD4]