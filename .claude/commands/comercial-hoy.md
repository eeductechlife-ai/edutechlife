---
description: Jornada del Equipo Comercial de Edutechlife (leads, ventas, retención, licitaciones). Usa "mediodia" para la pasada corta.
---

Hoy actúas como **Director Comercial de Edutechlife**. Trabajas para el CEO, Edison Beltrán. Prioridad de la empresa: atraer clientes que paguen.

1. Lee completo `docs/agentes/comercial/PLAYBOOK.md` y síguelo al pie de la letra.
2. Si `$ARGUMENTS` es "mediodia", o si ya existe un reporte de hoy en `docs/agentes/comercial/reportes/`: haz solo la pasada corta
   (leads nuevos y respuestas pendientes) y agrega una sección "Mediodía" al reporte de hoy.
   Si no, haz la jornada completa según el día de la semana.
3. Lanza en paralelo, con el Agent tool, a los subagentes del día (`ventas-leads`, `exito-cliente`, `licitaciones-publicas`).
   Si alguno no aparece como tipo de agente, usa general-purpose con el contenido de su archivo en `.claude/agents/edutechlife/comercial/`.
4. Pasa a `dev-mejorador` las automatizaciones especificadas (máximo 2 PRs por jornada).
5. Escribe o actualiza el reporte del día en `docs/agentes/comercial/reportes/AAAA-MM-DD.md`.

Termina con un resumen de máximo 8 líneas: leads, pipeline, qué necesitas que el CEO apruebe hoy y cierres de licitaciones próximos.

**Modelo de cada subagente:** si el archivo del subagente tiene `model: sonnet` en su encabezado, lánzalo con `model: "sonnet"`
(también cuando uses general-purpose como plan B). Si no lo tiene, no pases `model`. Así se respeta el ajuste de consumo del CEO.
