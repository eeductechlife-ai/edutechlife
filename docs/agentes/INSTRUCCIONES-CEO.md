# Equipos de agentes de Edutechlife — Guía del CEO

Dos equipos trabajan todos los días para ti. Tú decides y apruebas; ellos prueban, mejoran, investigan y preparan.
Prioridades fijadas por el CEO: **1) atraer clientes que paguen, 2) productos a nivel profesional, 3) foco.**

## Organigrama
```
                         CEO (Edison)
                 aprueba PRs y publicaciones
                              │
          ┌───────────────────┴───────────────────┐
  Director de Calidad                     Director de Marketing (CMO)
  /calidad-hoy  (L–S 5:30)                /marketing-hoy  (L–V 6:30)
  ├─ qa-explorador                        ├─ mkt-cliente-ideal (quién y dónde)
  ├─ qa-tutores-ia                        ├─ mkt-inteligencia-mercado
  ├─ qa-rendimiento-seo                   ├─ mkt-seo-local
  ├─ qa-seguridad-datos                   ├─ mkt-contenido-redes
  ├─ producto-radar-pro (nivel pro)       ├─ mkt-alianzas-b2b
  └─ dev-mejorador → Pull Requests        └─ mkt-analitica
                              │
            /informe-ceo (L–S 7:30) → tu resumen de una pantalla
            /radar-tendencias (domingo 7:00) → todos los agentes se ponen al día
            /retro-agentes (domingo 8:00) → los agentes se mejoran a sí mismos (vía PR que tú apruebas)
```

## Tu rutina (15–20 minutos al día)
1. Lee el informe del día (`docs/agentes/informes-ceo/`).
2. Aprueba o rechaza los PRs (rama `agentes/...`) en GitHub. Si rechazas, deja un comentario: los agentes aprenden de él.
3. Revisa las piezas de marketing en `docs/agentes/marketing/entregables/` y publica las que te gusten.
4. Escribe lo que quieras en `docs/agentes/FEEDBACK-CEO.md`. Es el volante: lo que pongas ahí cambia el rumbo.

## Cómo se mejoran solos
- Cada día anotan lo que falló en sus reportes.
- Cada domingo la retro revisa qué PRs aprobaste, qué piezas usaste, tus comentarios y los KPIs,
  actualiza su memoria (`APRENDIZAJES.md`) y propone cambios a sus propias instrucciones en un PR.
- Tú apruebas ese PR. Así mejoran cada semana sin salirse de control. Nunca pueden darse más permisos solos.

## Lo que no pueden hacer (por diseño)
Hacer merge o desplegar a producción · publicar en redes · enviar correos o mensajes · gastar dinero ·
usar datos de estudiantes reales · inventar cifras o alianzas.

## Lanzarlos a mano
En el Code tab, dentro de la carpeta edutechlife: `/calidad-hoy`, `/calidad-hoy ingenia`, `/marketing-hoy`,
`/marketing-hoy seo`, `/informe-ceo`, `/radar-tendencias`, `/retro-agentes`.
