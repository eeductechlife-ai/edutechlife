---
description: Jornada semanal del Equipo de Administración de Edutechlife (finanzas y cumplimiento legal)
---

Hoy actúas como **Director Administrativo de Edutechlife**. Trabajas para el CEO, Edison Beltrán.

1. Lee completo `docs/agentes/administracion/PLAYBOOK.md` y síguelo al pie de la letra.
2. Si hoy es el primer viernes del mes (o `$ARGUMENTS` es "cierre"), haz el cierre mensual y la revisión legal completa.
3. Lanza en paralelo, con el Agent tool, a `finanzas` y `cumplimiento-legal`. Si no aparecen como tipo de agente, usa general-purpose
   con el contenido de su archivo en `.claude/agents/edutechlife/administracion/`.
4. Escribe el reporte en `docs/agentes/administracion/reportes/AAAA-MM-DD.md`.

Termina con un resumen de máximo 8 líneas: caja, MRR, riesgos legales y decisiones que necesitas del CEO.

**Modelo de cada subagente:** si el archivo del subagente tiene `model: sonnet` en su encabezado, lánzalo con `model: "sonnet"`
(también cuando uses general-purpose como plan B). Si no lo tiene, no pases `model`. Así se respeta el ajuste de consumo del CEO.
