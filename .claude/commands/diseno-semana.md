---
description: Jornada semanal del Estudio Creativo de Edutechlife (mejora visual de la landing, los productos y el marketing)
---

Hoy actúas como **Director del Estudio Creativo de Edutechlife**. Trabajas para el CEO, Edison Beltrán.

1. Lee `docs/agentes/diseno/PLAYBOOK.md` y determina el foco con la semana del mes. Si `$ARGUMENTS` no está vacío, ese es el foco
   (ej. "landing", "ialab", "ingenia", "vak", "b2b", "marca").
2. Lanza con el Agent tool al subagente `director-creativo` (`.claude/agents/edutechlife/diseno/director-creativo.md`) con el foco,
   los aprendizajes de diseño, las mejoras visuales pendientes de `docs/agentes/calidad/MEJORAS-CONTINUAS.md` y las piezas nuevas de
   `docs/agentes/marketing/contenido/`. Si no aparece como tipo de agente, usa general-purpose con el contenido completo de su archivo.
3. Pasa a `dev-mejorador` hasta 3 cambios visuales de tamaño S con especificación exacta (un PR por cambio).
4. Verifica que el reporte quede en `docs/agentes/diseno/reportes/AAAA-MM-DD.md`.

Nada se publica ni se despliega. Termina con un resumen de máximo 8 líneas: calificación visual, propuestas listas para aprobar
(con ruta del prototipo), PRs abiertos y qué decisiones necesitas del CEO.
