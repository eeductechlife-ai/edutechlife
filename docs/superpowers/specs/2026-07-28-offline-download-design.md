# Offline Download: Descarga de Contenido para Estudio Sin Conexión

## Resumen

Extender `OfflineBanner` (hoy solo muestra alerta) con sistema completo de descarga de contenido para estudio offline. Usa Cache API para PDFs/imágenes, IndexedDB para datos estructurados, y Service Worker existente (workbox) para servir contenido cacheado.

## Arquitectura

```
Estado Online
  └── ResourceViewerModal
       └── PDF/Video/Infografia → fetch() normal desde Supabase

Estado Offline (nuevo)
  └── Service Worker → Cache API (PDFs, imágenes)
  └── IndexedDB → Datos estructurados (texto lecciones, metadata recursos)
  └── OfflineManager (nuevo) → Orquesta descargas, estado, progreso

Nuevos Componentes
  ├── useOfflineManager.js (hook) — orquesta descargas, estado, progreso
  ├── useOfflineStorage.js (hook) — interfaz con Cache API + IndexedDB
  ├── OfflinePanel.jsx — panel de gestión de descargas (modal)
  ├── DownloadButton.jsx — botón individual por recurso
  └── OfflineBanner — extendido con acceso al panel
```

## Estrategia de Datos

| Tipo | Almacenamiento | Descarga | Tamaño |
|------|---------------|----------|--------|
| PDFs (guías, infografías) | Cache API (`ialab-pdfs`) | fetch + cache.put | ~2-10 MB c/u |
| Imágenes | Cache API (`ialab-images`) | fetch + cache.put | ~100-500 KB |
| Texto lecciones | IndexedDB (`ialab-offline-store`) | JSON serializado | ~50-200 KB |
| Metadata recursos | IndexedDB | De constants/moduleResources/ | ~10 KB |
| Progreso offline | Zustand persist | Ya existe | N/A |

## Flujo de Descarga

1. Usuario hace clic en DownloadButton junto a recurso
2. useOfflineManager verifica si ya está descargado
3. Fetch del PDF desde Supabase Storage
4. caches.open('ialab-pdfs') → cache.put(url, response.clone())
5. Guarda metadata en IndexedDB
6. Actualiza estado downloaded: true
7. Badge de descarga completada

## Flujo Offline

1. Service Worker intercepta fetch
2. Match en Cache API → sirve desde cache
3. Metadata de lecciones → sirve desde IndexedDB
4. No match → OfflineBanner muestra recurso no disponible

## Nuevo Componente: OfflinePanel

Modal accesible desde OfflineBanner o del undermenu "Plan de Estudio".

Secciones:
- **Disponible offline**: badges por módulo con recursos descargados
- **Descargar todo**: botón "Descargar Módulo N" (descarga secuencial)
- **Almacenamiento**: barra de uso (estimado vs cuota Storage API)
- **Descargas activas**: progreso individual con barra + % + velocidad

## Nuevo Hook: useOfflineManager

```javascript
const {
  downloadResource,     // (url, metadata) → Promise<void>
  removeResource,       // (url) → Promise<void>
  getCachedResources,   // () → Array<{url, title, size, moduleId, downloadedAt}>
  getStorageEstimate,   // () → {usage, quota, percent}
  isDownloading,        // Set<string> — URLs en progreso
  downloadModule,       // (moduleId) → descarga todos los recursos del módulo
  getModuleStatus,      // (moduleId) → {total, downloaded, percent}
  isOnline,             // boolean
} = useOfflineManager()
```

## Nuevo Hook: useOfflineStorage

```javascript
const { saveToCache, getFromCache, saveToDB, getFromDB } = useOfflineStorage()
```

## Modificaciones de Archivos Existentes

### Crear
- `src/hooks/useOfflineManager.js` — hook principal (~120 líneas)
- `src/hooks/useOfflineStorage.js` — hook de almacenamiento (~80 líneas)
- `src/components/IALab/OfflinePanel.jsx` — panel modal (~150 líneas)
- `src/components/IALab/DownloadButton.jsx` — botón por recurso (~40 líneas)

### Modificar
- `src/components/IALab/OfflineBanner.jsx` — añadir botón "Gestión Offline"
- `src/components/IALab/ResourceViewerModal/index.jsx` — añadir DownloadButton a PDFs/images
- `src/i18n/es.json` — nuevas keys
- `src/i18n/en.json` — nuevas keys
- `src/i18n/keys.d.ts` — type definitions

## Nuevas i18n Keys

```json
"ialab.offline.download": "Descargar",
"ialab.offline.downloading": "Descargando...",
"ialab.offline.downloaded": "Descargado",
"ialab.offline.remove": "Eliminar descarga",
"ialab.offline.panel_title": "Gestión Offline",
"ialab.offline.storage_used": "{used} de {quota} usado",
"ialab.offline.module_section": "Módulo {id}",
"ialab.offline.download_module": "Descargar Módulo {id}",
"ialab.offline.resources_count": "{count} recursos",
"ialab.offline.manage_btn": "Gestión Offline",
"ialab.offline.not_available": "No disponible sin conexión",
"ialab.offline.error_download": "Error al descargar",
"ialab.offline.retry": "Reintentar",
"ialab.offline.completed": "¡Listo!",
"ialab.offline.pending": "Pendiente",
```

## No Incluido (Out of Scope)
- Videos YouTube offline (técnicamente inviable sin DRM)
- OVAs interactivas (requieren backend)
- Sincronización automática de descargas
- Compresión de PDFs antes de cachear
