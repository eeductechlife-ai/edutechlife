# Desafío - Sistema de Calificación Corregido (BENÉVOLO)

## Problema Identificado
El sistema de calificación era demasiado exigente (nivel 100% de exigencia). El estudiante está APRENDIENDO y no tiene nivel experto para hacer un "super prompt". Lo más importante es que entienda la **estructura de un prompt**: Rol + Contexto + Tarea + Formato.

## Solución Implementada

### Ejercicio 1: Identificar (Drag & Drop - 3 columnas)

| Columnas completadas | Nota | Razonamiento |
|---------------------|------|--------------|
| 0 de 3 (vacío) | 0% | No intentó |
| 1 de 3 | 33% | Entendió la idea básica |
| 2 de 3 | 70% | Demuestra comprensión |
| 3 de 3 (todas llenas) | 100% | Dominio de la estructura |

**IMPORTANTE:** Solo importa que haya completado las columnas, NO que estén perfectamente clasificadas.

### Ejercicio 2: Optimizar Prompt

| Criterio | Nota |
|----------|------|
| Escribió algo relacionado (aunque corto) | 50% |
| Prompt tiene 2+ elementos de estructura | 70% |
| Prompt completo y coherente (no perfecto) | 80% |
| Prompt excelente y detallado | 90-100% |

**Nota:** No se penaliza por falta de métricas o ejemplos. Lo importante es que entienda la estructura.

### Ejercicio 3: Crear Prompt desde Cero

| Criterio | Nota |
|----------|------|
| Escribió algo relacionado al desafío | 50% |
| Incluyó rol + tarea (elementos básicos) | 70% |
| Incluyó rol + contexto + tarea + detalle | 80% |
| Prompt completo, coherente y estructurado | 90-100% |

**Nota:** Se valora el intento de crear un prompt con estructura. No se exige perfección.

### Nota Global

```
notaGlobal = (nota_ej1 + nota_ej2 + nota_ej3) / 3
Aprobación: 80%
```

### Ejemplos de Notas Globales

| Ej1 | Ej2 | Ej3 | Global | Estado |
|-----|-----|-----|--------|--------|
| 33% | 50% | 50% | 44.3% | ❌ |
| 70% | 60% | 60% | 63.3% | ❌ |
| 70% | 70% | 70% | 70% | ❌ |
| 100% | 70% | 70% | 80% | ✅ |
| 100% | 80% | 80% | 86.7% | ✅ |
| 100% | 90% | 90% | 93.3% | ✅ |

### Feedback Benévolo

Cada feedback incluye:
1. **Refuerzo positivo** (qué hizo bien, aunque sea pequeño)
2. **Sugerencia amable** de mejora (no crítica dura)
3. **Ejemplo breve** de cómo mejorar
4. **Tip práctico** para recordar: Rol + Contexto + Tarea + Formato

## Archivos Modificados

1. `/src/hooks/IALab/useIALabEvaluation.js`
   - System prompt de DeepSeek: énfasis en evaluación benévola
   - Criterios de calificación reducidos a 80% de exigencia
   - Fallback local con lógica generosa

## Fallback Local (cuando API no disponible)

El fallback analiza:
- **Ej1:** Cantidad de columnas completadas (0, 1, 2, 3)
- **Ej2:** Longitud de respuesta (<20, <100, <250, >=250 chars)
- **Ej3:** Longitud de respuesta (<30, <150, <350, >=350 chars)

Cada nivel tiene feedback específico y constructivo.
