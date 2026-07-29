# API Endpoints Reference

## SmartBoard (`/api/smartboard`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /data/:userId | Sí | No | Datos de estudiante |
| GET | /progress/:userId | Sí | No | Progreso del estudiante |
| POST | /chat | Sí | 20/min | Chat con tutor Dani |
| POST | /chat/stream | Sí | 20/min | SSE streaming del chat |

## IALab (`/api/ialab`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /prompts | No | No | Lista de plantillas de prompts |
| POST | /prompts | No | No | Generar MasterPrompt con IA |
| POST | /evaluate-prompt | No | No | Evaluación local de prompt |
| GET | /resources | No | No | Recursos educativos (filtro: moduleId, resourceType) |
| GET | /modules | No | No | Módulos disponibles |
| GET | /modules/:id | No | No | Detalle de módulo (1-5) |
| POST | /progress | Sí | No | Guardar progreso |
| GET | /progress/:userId | Sí | No | Obtener progreso |
| POST | /templates | Sí | No | Crear plantilla |
| GET | /templates/:userId | Sí | No | Plantillas del usuario |
| PUT | /templates/:templateId | Sí | No | Actualizar plantilla |
| DELETE | /templates/:templateId | Sí | No | Eliminar plantilla |

## Chat (`/api/chat`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | / | No | 20/min | Chat general con DeepSeek |
| POST | /stream | No | 20/min | SSE streaming chat |

## Stripe (`/api/stripe`)

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /create-checkout-session | Sí | No | Crear sesión de pago |
| POST | /webhook | No (firma) | No | Webhook de Stripe |

## TTS / Voice

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /api/tts | No | No | Text-to-Speech (Google TTS) |
| GET | /api/voice-token | No | 10/min | Token de Google Voice |

## Health

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| GET | /api/health | No | No | Health check |

## Auth

| Método | Ruta | Auth | Rate Limit | Descripción |
|--------|------|------|------------|-------------|
| POST | /api/auth/webhook | Firma Clerk | No | Webhook de Clerk (registro) |

### Error Response
```json
{ "success": false, "error": "Mensaje descriptivo" }
```

### Rate Limiting
- API global: 100 requests / 15 min
- DeepSeek: 20 requests / min
- Auth endpoints: 10 requests / min
