---
name: ai-rag-pipeline
description: Construcción de pipelines RAG (Retrieval Augmented Generation) para investigación y fact-checking con IA. Combina búsqueda web con LLMs para respuestas fundamentadas y verificables.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: ai
  triggers:
    - rag
    - research
    - busqueda
    - investigacion
    - pipeline
    - sources
    - ia
---

# ai-rag-pipeline

Build RAG (Retrieval Augmented Generation) pipelines via búsqueda web y LLMs.

## When to use

Utiliza esta skill cuando necesites:

- **Investigación automatizada:** Buscar información actualizada en la web
- **Fact-checking:** Verificar afirmaciones con fuentes múltiples
- **Knowledge retrieval:** Extraer información de documentos y URLs
- **Análisis fundamentado:** Generar respuestas con citas y referencias
- **Reportes de IA:** Crear informes estructurados con datos verificados

**Palabras clave que activan esta skill:** `rag`, `research`, `busqueda`, `investigacion`, `pipeline`, `sources`, `ia`

> **NOTE:** Esta skill requiere herramientas externas (Tavily, Exa, OpenRouter) para funcionar completamente. Para uso básico, sigue las instrucciones de abajo.

## Instructions

### 1. Patrones de Pipeline RAG

#### Patrón 1: Búsqueda + Respuesta
```
[Usuario] → [Búsqueda Web] → [LLM con Contexto] → [Respuesta]
```

#### Patrón 2: Investigación Multi-Fuente
```
[Consulta] → [Búsquedas Múltiples] → [Agregar] → [Análisis LLM] → [Reporte]
```

#### Patrón 3: Extraer + Procesar
```
[URLs] → [Extracción de Contenido] → [Dividir] → [Resumen LLM] → [Salida]
```

### 2. Herramientas Disponibles

| Herramienta | Mejor Para |
|-------------|------------|
| Tavily Search | Búsqueda con respuestas directas |
| Exa Search | Búsqueda semántica y neural |
| Exa Answer | Respuestas factuales directas |

### 3. Pipeline de Ejemplo

```bash
# 1. Buscar información
SEARCH=$(infsh app run tavily/search-assistant --input '{
  "query": "últimos desarrollos en IA 2024"
}')

# 2. Generar respuesta fundamentada
infsh app run openrouter/claude-sonnet-45 --input "{
  \"prompt\": \"Basándote en esta investigación, resume las tendencias clave:

$SEARCH

Proporciona un resumen bien estructurado con citas de fuentes.\"
}"
```

### 4. Mejores Prácticas

#### Optimización de Consultas
```bash
# ❌ Muy vago
"noticias de IA"

# ✅ Específico y contextual
"últimos desarrollos en large language models enero 2024"
```

#### Gestión de Contexto
```bash
# Resumir resultados muy largos antes de enviar al LLM
SUMMARY=$(infsh app run openrouter/claude-haiku-45 --input "{
  \"prompt\": \"Resume estos resultados de búsqueda en puntos clave: $SEARCH\"
}")
```

#### Atribución de Fuentes
```bash
# Siempre pedir al LLM que cite fuentes
infsh app run openrouter/claude-sonnet-45 --input '{
  "prompt": "... Siempre cita fuentes en [Nombre Fuente](URL) formato."
}'
```

## Errores Comunes

| Problema | Solución |
|----------|----------|
| Resultados muy largos | Resumir antes de enviar al LLM |
| Sin fuentes | Incluir explícitamente "cite sources" en el prompt |
| Consultas muy vagas | Ser específico y contextual |
| Búsqueda muy lenta | Usar modelo rápido (haiku) para búsquedas |

## Véase También

- [Adding Tools to Agents](https://inference.sh/docs/agents/adding-tools)
- [Building a Research Agent](https://inference.sh/blog/guides/research-agent)