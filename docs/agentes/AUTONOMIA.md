# Escalera de autonomía de los agentes

Define qué pueden hacer los agentes **sin pedir aprobación**. Solo el CEO sube o baja un nivel, aprobando un PR que
cambie este archivo o escribiéndolo en `docs/agentes/FEEDBACK-CEO.md`. La retro semanal puede **proponer** subir un nivel cuando
una acción lleve ~4 semanas aprobándose sin cambios; nunca puede subirlo por su cuenta.

Niveles:
- **0 · Borrador** — el agente prepara; el CEO revisa y ejecuta.
- **1 · Automático con aviso** — el agente (o la automatización dentro de la plataforma) ejecuta y lo informa en el reporte del día.
- **2 · Automático** — se ejecuta solo y se resume en el informe semanal.

| Acción | Nivel actual | Condición para subir |
|---|---|---|
| Abrir PRs de arreglos, contenido y automatizaciones | 1 | — (merge siempre lo hace el CEO) |
| Respuesta automática al lead recién llegado (plantilla aprobada, dentro de la plataforma) | 0 | CEO aprueba la plantilla y el PR que la implementa |
| Secuencia de seguimiento a leads (día 2, 5, 10) | 0 | 4 semanas de borradores aprobados sin cambios |
| Correos de ciclo de vida a usuarios (bienvenida, inactividad, logros) | 0 | CEO aprueba plantillas y PR |
| Publicar en redes sociales (vía herramienta de programación) | 0 | 4 semanas de piezas aprobadas sin cambios + herramienta conectada |
| Responder reseñas positivas | 0 | 4 semanas de respuestas aprobadas sin cambios |
| Responder reseñas negativas o quejas | 0 | Siempre nivel 0 |
| Enviar correos a colegios, empresas o entidades | 0 | Siempre nivel 0 |
| Presentarse a licitaciones o convocatorias | 0 | Siempre nivel 0 |
| Cualquier movimiento de dinero, precio, descuento o reembolso | 0 | Siempre nivel 0 |
| Merge a `main`, despliegues, migraciones de base de datos | 0 | Siempre nivel 0 |
| Cualquier contacto directo con menores con fines comerciales | — | Prohibido |
