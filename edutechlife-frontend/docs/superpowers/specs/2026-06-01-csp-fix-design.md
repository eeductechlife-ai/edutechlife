# CSP (Content Security Policy) Fix Design

**Goal:** Corregir la CSP para que permita todos los recursos externos que la aplicación ya carga, sin alterar funcionalidad.

**Architecture:** CSP vía `<meta http-equiv="Content-Security-Policy">` en `index.html`. No se usan headers HTTP para evitar cambios de infraestructura.

**Tech Stack:** Content Security Policy Level 2, meta tag.

---

## Background

La CSP fue agregada en Phase 1 Sprint 4 con dominios incompletos, causando 3 errores en consola:

1. Clerk JS bloqueado — script-src no incluía `*.clerk.accounts.dev` ni `cdn.jsdelivr.net`
2. Google Fonts bloqueado — style-src no incluía `fonts.googleapis.com`; font-src no incluía `fonts.gstatic.com`
3. PDF.js worker bloqueado — script-src no incluía `cdnjs.cloudflare.com`

## Audit de Recursos Externos

Revisión exhaustiva del codebase (junio 2026):

| Recurso | Tipo | Archivo(s) | Necesario en CSP |
|---------|------|------------|------------------|
| `cdn.jsdelivr.net` | script | `index.html:33` (Clerk JS) | ✅ `script-src` |
| `*.clerk.accounts.dev` | script, connect | Clerk runtime dinámico | ✅ `script-src`, `connect-src` |
| `accounts.clerk.com` | script, connect | Fallback Clerk | ✅ `script-src` |
| `clerk.edutechlife.com` | script | Dominio legacy | ✅ `script-src` |
| `fonts.googleapis.com` | style | `index.css:1` (@import) | ✅ `style-src` |
| `fonts.gstatic.com` | font | Descargado por Google Fonts | ✅ `font-src` |
| `cdnjs.cloudflare.com` | script/worker | `documentParser.js:3` (PDF.js) | ✅ `worker-src`, `script-src` |
| `*.supabase.co` | connect, img | Supabase API, Storage, WS | ✅ `connect-src`, `img-src` |
| `*.clerk.com` | connect | Clerk API | ✅ `connect-src` |
| `www.youtube.com` | frame | Videos embebidos | ✅ `frame-src` |
| `api.deepseek.com` | — | Solo backend (`server.js`) | No necesario |
| `meet.google.com` | — | Solo `<a href>` link | No necesario |
| Redes sociales | — | Solo `<a href>` links | No necesario |

## CSP Final

```
default-src 'self';
script-src 'self' https://clerk.edutechlife.com https://accounts.clerk.com
  https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://cdnjs.cloudflare.com
  'unsafe-inline';
worker-src 'self' https://cdnjs.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
connect-src 'self' https://*.supabase.co https://*.clerk.com
  https://*.clerk.accounts.dev wss://*.supabase.co;
font-src 'self' https://fonts.gstatic.com;
frame-src 'self' https://www.youtube.com;
```

## Cobertura

- ✅ Clerk login/registro funciona (script + connect)
- ✅ Google Fonts carga correctamente (style + font)
- ✅ PDF.js worker carga sin bloqueos (worker + script)
- ✅ Supabase API + WebSockets + Storage
- ✅ YouTube videos embebidos
- ✅ Imágenes desde cualquier HTTPS (img-src `https:`)
- ✅ Sin cambios funcionales
