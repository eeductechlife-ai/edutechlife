# ADR-003: Extracción de GamificationContext y SessionContext

**Fecha:** 2026-07-29
**Estado:** Aceptado

## Contexto
SmartBoardKidsContext (494 líneas) manejaba ~40 estados en un solo provider con un efecto que observaba todas las variables. Cada cambio disparaba re-renders en todos los consumidores y 30+ localStorage writes.

## Decisión
Extraer dominios independientes en contextos separados que consumen de SmartBoardKidsContext:
- `GamificationContext` — totalPoints, streak, missions, streakLog
- `SessionContext` — sessions, subjectTime, totalActiveMinutes
- SmartBoardKidsContext se mantiene como fuente de verdad única

## Consecuencias
- Componentes que solo usan gamificación ya no re-renderizan cuando cambian sesiones
- Código más mantenible: cada contexto <20 líneas
- Los providers se montan como hijos de SmartBoardKidsProvider en el árbol
- No hay migración forzosa — el consumo via useSmartBoardKids() sigue funcionando
