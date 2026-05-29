# M1 Exam Improvements Design

## Problema
El examen del Módulo 1 (Prompt Engineering) tiene 4/8 preguntas desalineadas con los recursos, 0 preguntas de análisis, y UX de navegación limitada.

## Cambios en Preguntas (ialabQuizData.js)

### Reemplazar Q2 (Chain-of-Thought → Análisis RTF)
Escenario: Mostrar un prompt incompleto y pedir identificar qué componente RTF falta.
Dificultad: medio | Tipo: análisis

### Reemplazar Q4 (Zero-Shot → Aplicación sobre recursos)
Basado en el video "Cómo crear un buen prompt" + PDF guía. Preguntar orden correcto de construcción.
Dificultad: medio | Tipo: aplicación

### Reemplazar Q5 (Contexto Dinámico → Análisis de prompt)
Mostrar prompt genérico, pedir identificar problemas y cómo mejorarlo con RTF.
Dificultad: difícil | Tipo: análisis

### Reemplazar Q7 (Few-Shot vs Zero-Shot → Análisis comparativo)
Mostrar dos prompts, uno con RTF completo y otro sin estructura. Pedir identificar cuál funciona mejor y por qué.
Dificultad: difícil | Tipo: análisis

## Cambios UX (IALabQuizModal.jsx)

### Question Palette
Barra de 8 dots entre el header y las preguntas, color-coded:
- Verde: respondida
- Gris: no respondida  
- Amarillo: marcada para revisión
Click → navega a esa pregunta

### Mark for Review
Botón toggle por pregunta. Estado persiste en store.

### Submit Confirmation
Al hacer submit, si hay preguntas sin responder, mostrar modal de confirmación.

## Archivos a modificar
- src/data/ialabQuizData.js — Reemplazar preguntas
- src/components/IALab/IALabQuizModal.jsx — Añadir palette, mark-for-review, confirm
