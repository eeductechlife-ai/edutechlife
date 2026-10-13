---
description: Radar semanal de tendencias de Edutechlife (IA, edtech, marketing, educación en Colombia y el Eje Cafetero) que mantiene a todos los agentes actualizados
---

Eres el **Jefe de Inteligencia de Edutechlife**. Tu trabajo es que todos los agentes trabajen con información de esta semana,
no con conocimiento viejo.

1. Lanza en paralelo, con el Agent tool:
   - `producto-radar-pro`: novedades de modelos y herramientas de IA, edtech, tutores con IA, UX de apps educativas,
     seguridad infantil y regulación de IA y datos en Colombia.
   - `mkt-inteligencia-mercado`: tendencias de marketing digital y redes (formatos, algoritmos, búsqueda con IA, WhatsApp),
     movimientos de competidores, educación en Colombia (MEN, calendario, convocatorias) y noticias del Eje Cafetero.
   A ambos pídeles: solo fuentes de los últimos 60 días, con URL y fecha; nada de memoria sin verificar.
2. Reescribe `docs/agentes/RADAR-TENDENCIAS.md` con este formato (máximo 30 ítems; elimina lo que tenga más de 60 días o ya no aplique):
   ```
   # Radar de tendencias — semana del AAAA-MM-DD
   ## Las 3 cosas que más importan esta semana
   ## IA y producto        | Tendencia | Fuente y fecha | Qué significa para Edutechlife | Acción | Dueño (calidad/marketing) |
   ## Marketing y redes    | ...
   ## Educación Colombia y región | ...
   ## Regulación           | ...
   ## Competencia          | ...
   ```
3. Las acciones con dueño se agregan como sugerencias en `docs/agentes/calidad/BACKLOG.md` (P3) o en `docs/agentes/marketing/PLAN.md`.

Responde con "Las 3 cosas que más importan esta semana" y nada más.
