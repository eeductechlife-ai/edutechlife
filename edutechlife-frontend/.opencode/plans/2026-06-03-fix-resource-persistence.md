# Plan: Fix Persistencia de Recursos Vistos en IALab

## Bug #1: `ls` utility pierde datos por queueMicrotask

### Archivo: `src/utils/ialab.js` (líneas 8-42)

Reemplazar todo el objeto `ls`:

**Actual:**
```javascript
export const ls = {
  _pending: null,
  _flush: () => {
    if (!ls._pending) return;
    const batch = ls._pending;
    ls._pending = null;
    try {
      for (const [key, value] of batch) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {}
  },
  get: (key, fallback = null) => {
    if (ls._pending?.has(key)) return ls._pending.get(key);
    try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : fallback; } catch { return fallback; }
  },
  set: (key, value) => {
    if (!ls._pending) { ls._pending = new Map(); queueMicrotask(ls._flush); }
    ls._pending.set(key, value);
  },
  remove: (key) => {
    if (ls._pending?.has(key)) ls._pending.delete(key);
    try { localStorage.removeItem(key); } catch {}
  },
};
```

**Nuevo:**
```javascript
export const ls = {
  get: (key, fallback = null) => {
    try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : fallback; } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};
```

---

## Bug #2: TopicResourcesModal resetea viewedIds

### Archivo: `src/components/IALab/TopicResourcesModal.jsx` (línea 68)

Eliminar `setViewedIds([])` del Effect B:

**Actual (63-72):**
```javascript
useEffect(() => {
  if (topicData && resources.length > 0) {
    setActiveResourceIndex(0);
    setViewerModalOpen(false);
    setSelectedResource(null);
    setViewedIds([]);   // ← ELIMINAR
    setOvaModalOpen(false);
    setImmersivePdfModalOpen(false);
  }
}, [topicData, resources.length]);
```

**Nuevo:**
```javascript
useEffect(() => {
  if (topicData && resources.length > 0) {
    setActiveResourceIndex(0);
    setViewerModalOpen(false);
    setSelectedResource(null);
    setOvaModalOpen(false);
    setImmersivePdfModalOpen(false);
  }
}, [topicData, resources.length]);
```

---

## Bug #3: ModuleOverviewCard no reacciona + unificar datasource

### Archivo: `src/store/slices/lessonSlice.js`

**3a)** Cambiar `getViewedResources()` para leer de `moduleProgress`:
```javascript
getViewedResources: () => {
  const state = get();
  const allViewed = [];
  Object.values(state.moduleProgress || {}).forEach(mod => {
    if (mod.viewedResources?.length) allViewed.push(...mod.viewedResources);
  });
  return allViewed;
},
```

**3b)** Agregar `_viewedResourcesVersion: 0` al initialState (línea 24 aprox):
```javascript
lastVisitedLesson: null,
_viewedResourcesVersion: 0,
completedVideos: ls.get(LS_KEYS.COMPLETED_VIDEOS, []),
```

**3c)** Modificar `addViewedResource` para incrementar version:
```javascript
addViewedResource: (id) => {
  const viewed = get().getViewedResources();
  if (!viewed.includes(id)) {
    const updated = [...viewed, id];
    ls.set(LS_KEYS.VIEWED_RESOURCES, updated);
    set({ _viewedResourcesVersion: Date.now() });
  }
},
```

### Archivo: `src/components/IALab/ModuleOverviewCard.jsx`

Reemplazar líneas 202-210:

**Actual:**
```javascript
useEffect(() => {
  setViewedIds(useIALabStore.getState().getViewedResources());
}, []);

useEffect(() => {
  if (!viewerModalOpen) {
    setViewedIds(useIALabStore.getState().getViewedResources());
  }
}, [viewerModalOpen]);
```

**Nuevo:**
```javascript
useEffect(() => {
  const updateViewed = () => setViewedIds(useIALabStore.getState().getViewedResources());
  updateViewed();
  const unsub = useIALabStore.subscribe(
    (s) => s._viewedResourcesVersion,
    updateViewed
  );
  return unsub;
}, []);
```

---

## Bug #4: OVAViewer ignora onComplete + falta botón manual

### Archivo: `src/components/IALab/ResourceViewerModal/OVAViewer.jsx`

**4a)** Cambiar props y auto-complete:
```javascript
const OVAViewer = ({ resource, onClose, onComplete }) => {
  const autoMarkedRef = useRef(false);
  useEffect(() => {
    if (!autoMarkedRef.current) {
      autoMarkedRef.current = true;
      onComplete?.();
    }
  }, [onComplete]);
```

**4b)** Actualizar PropTypes:
```javascript
OVAViewer.propTypes = {
  resource: PropTypes.any,
  onClose: PropTypes.any,
  onComplete: PropTypes.any,
};
```

### Archivo: `src/components/IALab/ResourceViewerModal/index.jsx`

Agregar botón "Mark as Viewed" para OVA/video (líneas 431-435):

**Actual:**
```javascript
) : resource.type === 'video' || resource.type === 'ova' || resource.type === 'ova_interactive' || resource.type === 'ova-thumbnail' ? (
  <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-corporate/10 border border-corporate/20 text-corporate font-medium flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-center">
    <Icon name="fa-hourglass-half" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
    <span>{t('ialab.viewer_modal.complete_resource_hint')}</span>
  </div>
) : resource.type === 'pdf' || resource.type === 'pdf-thumbnail' ? (
```

**Nuevo:**
```javascript
) : resource.type === 'video' || resource.type === 'ova' || resource.type === 'ova_interactive' || resource.type === 'ova-thumbnail' ? (
  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
    <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-corporate/10 border border-corporate/20 text-corporate font-medium flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-center">
      <Icon name="fa-hourglass-half" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span>{t('ialab.viewer_modal.complete_resource_hint')}</span>
    </div>
    <button
      onClick={handleMarkAsViewed}
      aria-label={t('ialab.viewer_modal.mark_viewed')}
      className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base justify-center border-none bg-gradient-to-r from-petroleum to-corporate hover:from-corporate-deep hover:to-corporate-darker text-white shadow-md hover:shadow-lg"
    >
      <Icon name="fa-check" className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{t('ialab.viewer_modal.mark_viewed')}</span>
    </button>
  </div>
) : resource.type === 'pdf' || resource.type === 'pdf-thumbnail' ? (
```
