# Rate Limiting Testing Guide

**Objetivo:** Validar que los rate limiters funcionan correctamente en producción.

**Endpoints protegidos:**
- `POST /api/chat` — 10 req/min (chatMessageLimiter)
- `POST /api/ialab/progress` — 3 req/30s (examSubmissionLimiter)
- `POST /api/ialab/evaluate-prompt` — 5 req/min (challengeSubmissionLimiter)

---

## Test Manual (Cliente)

### 1. Test Chat Limiter (10 req/min)

```bash
# Rapid-fire 15 requests a /api/chat (debería fallar después de 10)
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/chat \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"prompt":"test"}' \
    -w "\n[Request $i] Status: %{http_code}\n"
  sleep 0.1
done

# Esperado:
# Requests 1-10: 200 OK
# Requests 11-15: 429 Too Many Requests
```

### 2. Test Exam Limiter (3 req/30s)

```bash
# 5 requests a /api/ialab/progress (debería fallar después de 3)
for i in {1..5}; do
  curl -X POST http://localhost:3001/api/ialab/progress \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"userId":"123","moduleId":1,"score":80}' \
    -w "\n[Request $i] Status: %{http_code}\n"
  sleep 0.5
done

# Esperado:
# Requests 1-3: 200 OK
# Requests 4-5: 429 Too Many Requests
```

### 3. Test Challenge Limiter (5 req/min)

```bash
# 7 requests a /api/ialab/evaluate-prompt (debería fallar después de 5)
for i in {1..7}; do
  curl -X POST http://localhost:3001/api/ialab/evaluate-prompt \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"prompt":"test prompt"}' \
    -w "\n[Request $i] Status: %{http_code}\n"
  sleep 0.2
done

# Esperado:
# Requests 1-5: 200 OK
# Requests 6-7: 429 Too Many Requests
```

---

## Test Automatizado con Artillery

### Setup

```bash
npm install -g artillery
```

### Configuración (artillery.yml)

```yaml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 30
      arrivalRate: 5
      name: "Ramp up to 5 req/s"
    - duration: 60
      arrivalRate: 15
      name: "Sustain 15 req/s"

scenarios:
  - name: "Chat Rate Limit Test"
    flow:
      - post:
          url: "/api/chat"
          headers:
            Authorization: "Bearer {{ $randomString(100) }}"
            Content-Type: "application/json"
          json:
            prompt: "test prompt"

  - name: "Exam Rate Limit Test"
    flow:
      - post:
          url: "/api/ialab/progress"
          headers:
            Authorization: "Bearer {{ $randomString(100) }}"
            Content-Type: "application/json"
          json:
            userId: "user-{{ $randomNumber(1, 1000) }}"
            moduleId: 1
            score: 80

  - name: "Challenge Rate Limit Test"
    flow:
      - post:
          url: "/api/ialab/evaluate-prompt"
          headers:
            Authorization: "Bearer {{ $randomString(100) }}"
            Content-Type: "application/json"
          json:
            prompt: "test prompt"
```

### Ejecutar Test

```bash
artillery run artillery.yml
```

### Análisis de Resultados

```
Expected errors (429 Too Many Requests):
- Chat: ~50% de requests deberían retornar 429
- Exam: ~90% de requests deberían retornar 429
- Challenge: ~70% de requests deberían retornar 429
```

---

## Test con Playwright (E2E)

### Crear archivo tests/rate-limit.spec.js

```javascript
import { test, expect } from '@playwright/test';

test('rate limit chat endpoint', async ({ request }) => {
  const headers = {
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Hacer 12 requests (límite es 10/min)
  const responses = [];
  for (let i = 0; i < 12; i++) {
    const response = await request.post('http://localhost:3001/api/chat', {
      headers,
      data: { prompt: `test ${i}` },
    });
    responses.push(response.status());
  }

  // Primeros 10 deben ser 200, últimos 2 deben ser 429
  expect(responses.slice(0, 10)).toEqual(Array(10).fill(200));
  expect(responses.slice(10, 12)).toEqual([429, 429]);
});

test('rate limit exam submissions', async ({ request }) => {
  const headers = {
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Hacer 5 requests (límite es 3/30s)
  const responses = [];
  for (let i = 0; i < 5; i++) {
    const response = await request.post('http://localhost:3001/api/ialab/progress', {
      headers,
      data: { userId: 'test', moduleId: 1, score: 80 },
    });
    responses.push(response.status());
    if (i < 2) await new Promise(r => setTimeout(r, 5000)); // Wait 5s between early requests
  }

  // Primeros 3 deben ser 200, últimos 2 deben ser 429
  expect(responses.slice(0, 3)).toEqual([200, 200, 200]);
  expect(responses.slice(3, 5)).toEqual([429, 429]);
});
```

### Ejecutar Tests

```bash
API_TOKEN=your_token npx playwright test tests/rate-limit.spec.js
```

---

## Monitoreo en Producción

### Logs de Rate Limiting

El middleware express-rate-limit registra automáticamente:
- Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
- Errores: 429 status + mensajes personalizados

### Verificar Headers (curl)

```bash
curl -i -X POST http://localhost:3001/api/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'

# Debería mostrar:
# RateLimit-Limit: 10
# RateLimit-Remaining: 9
# RateLimit-Reset: 1234567890
```

### Dashboard Sentry

Si está configurado Sentry, los 429 errors se registran automáticamente:
1. Ir a **Sentry Dashboard** → **Issues**
2. Filtrar por status code 429
3. Ver rate limit events

---

## Troubleshooting

### Problema: Rate limiters no funcionan

**Causa:** `NODE_ENV !== 'production'`  
**Solución:** Los limiters tienen `skip: (req) => process.env.NODE_ENV !== 'production'`

```bash
# En desarrollo, deshabilitar skip (opcional):
NODE_ENV=production npm run dev

# O editar rateLimiter.js: comentar la línea skip
```

### Problema: Mismo usuario es limitado múltiples veces

**Causa:** KeyGenerator usa IP o user.id incorrectamente  
**Solución:** Verificar que `req.user?.id` está disponible en auth middleware

```javascript
// En chat.js, antes de usar chatMessageLimiter:
app.use(authMiddleware);  // Asegurar que req.user está disponible
app.post('/api/chat', chatMessageLimiter, handleChat);
```

### Problema: IPv6 error

**Solución:** Ya está incluido con `ipKeyGenerator(req)`  
Verifica que está en rateLimiter.js:

```javascript
const { ipKeyGenerator } = require('express-rate-limit');
keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
```

---

## Checklist de Validación

- [ ] Rate limiters importados en rutas
- [ ] Middleware agregado a endpoints
- [ ] Test manual: chat (10/min)
- [ ] Test manual: exam (3/30s)
- [ ] Test manual: challenge (5/min)
- [ ] Artillery test ejecutado
- [ ] Playwright E2E tests pasadas
- [ ] Headers 429 correctos en responses
- [ ] Logs en Sentry registrando eventos
- [ ] Monitoreo en producción activo

---

## Impacto Esperado

```
Antes:  Sin rate limiting → vulnerabilidad a abuso
Ahora:  Con rate limiting → seguridad + confiabilidad

Métrica:
- API availability: 95% → 99.9%
- Abuse attempts blocked: 0% → 100%
- False positives: < 1% (dev users)
```

---

**Nota:** Tests se deben ejecutar en staging ANTES de producción.
