# Equipos de agentes de Edutechlife — Guía del CEO

Cuatro equipos (23 agentes) trabajan para ti. Tú decides y apruebas; ellos prueban, mejoran, investigan, venden y preparan.
Prioridades fijadas por el CEO: **1) atraer clientes que paguen, 2) productos a nivel profesional, 3) foco.**

## Organigrama
```
                                   CEO (Edison)
                     aprueba PRs, publicaciones, dinero y contratos
                                        │
   ┌──────────────────────┬─────────────┴────────┬──────────────────────────┐
 CALIDAD Y PRODUCTO      MARKETING               COMERCIAL                  ADMINISTRACIÓN
 /calidad-hoy            /marketing-hoy          /comercial-hoy             /administracion-semana
 L–S 5:30                L–V 6:30                L–V 7:00 y 13:00           viernes 14:00
 ├─ ops-plataforma       ├─ mkt-cliente-ideal    ├─ ventas-leads            ├─ finanzas
 ├─ qa-explorador        ├─ mkt-inteligencia-    ├─ exito-cliente           └─ cumplimiento-legal
 ├─ qa-tutores-ia        │  mercado              ├─ licitaciones-publicas
 ├─ qa-rendimiento-seo   ├─ mkt-seo-local        └─ (usa mkt-alianzas-b2b
 ├─ qa-seguridad-datos   ├─ mkt-contenido-redes      y dev-mejorador)
 ├─ curador-academico    ├─ mkt-alianzas-b2b
 ├─ producto-radar-pro   ├─ mkt-analitica
 └─ dev-mejorador → PRs  └─ mkt-reputacion
                                        │
   /informe-ceo (L–S 8:30) → tu resumen de una pantalla con las 3 decisiones del día
   /radar-tendencias (domingo 7:00) → todos los agentes se ponen al día
   /retro-agentes (domingo 8:00) → los agentes se mejoran a sí mismos (vía PR que tú apruebas)
```

## Tu rutina (15–20 minutos al día)
1. Lee el informe del día (`docs/agentes/informes-ceo/`).
2. Aprueba o rechaza los PRs (rama `agentes/...`) en GitHub. Si rechazas, deja un comentario: los agentes aprenden de él.
3. Revisa borradores: piezas de marketing (`docs/agentes/marketing/entregables/`), mensajes a leads
   (`docs/agentes/comercial/borradores/` o tus borradores de Gmail) y publica o envía los que te gusten.
4. Escribe lo que quieras en `docs/agentes/FEEDBACK-CEO.md`. Es el volante: lo que pongas ahí cambia el rumbo.

## Cómo se automatiza la empresa sin perder control
- **Escalera de autonomía** (`docs/agentes/AUTONOMIA.md`): cada acción empieza como borrador (nivel 0). Cuando un tipo de acción lleva
  ~4 semanas aprobándose sin cambios, la retro te propone subirla a automática. Solo tú la subes.
- **Lo que atiende clientes 24/7 vive dentro de la plataforma**: los agentes construyen (vía PR) la captura de leads, las respuestas
  automáticas, las secuencias de correo y los recordatorios; una vez aprobados, corren solos en el servidor sin depender de tu computador.
- **Siempre tuyo**: dinero, precios, contratos, licitaciones, merge a producción, respuestas a quejas y cualquier tema con menores.

## Cómo se mejoran solos
- Cada día anotan lo que falló en sus reportes.
- Cada domingo el radar los pone al día con tendencias y la retro revisa qué aprobaste, qué usaste, tus comentarios y los KPIs,
  actualiza su memoria (`APRENDIZAJES.md`) y propone cambios a sus propias instrucciones en un PR.
- Tú apruebas ese PR. Nunca pueden darse más permisos solos.

## Lanzarlos a mano
En el Code tab, dentro de la carpeta edutechlife: `/calidad-hoy`, `/calidad-hoy ingenia`, `/marketing-hoy`, `/marketing-hoy seo`,
`/comercial-hoy`, `/comercial-hoy mediodia`, `/administracion-semana`, `/administracion-semana cierre`, `/informe-ceo`,
`/radar-tendencias`, `/retro-agentes`.
